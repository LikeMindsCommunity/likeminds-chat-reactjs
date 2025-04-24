pipeline {
    agent any

    environment {
        NODE_ENV       = 'development' // Don’t set to production to allow dev deps
        NPM_TOKEN      = credentials('ISHAAN_NPM_TOKEN')
        SLACK_WEBHOOK  = credentials('SLACK_JS_CHANNEL_URL')
        REPO           = 'LikeMindsCommunity/likeminds-chat-reactjs'
    }

    tools {
        nodejs 'nodejs'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check git tags') {
            steps {
                dir('core') {
                    script {
                        sh 'git fetch --tags'

                        def previousVersion = sh(
                            script: 'git describe --tags --abbrev=0',
                            returnStdout: true
                        ).trim()

                        def currentVersion = sh(
                            script: "node -p \"require('./package.json').version\"",
                            returnStdout: true
                        ).trim()

                        echo "Previous version: ${previousVersion}, Current version: v${currentVersion}"

                        if (previousVersion != "v${currentVersion}") {
                            echo "Version has changed from ${previousVersion} to v${currentVersion}."
                        } else {
                            echo 'Version has not changed.'
                            error "Stopping the pipeline as the version hasn't changed."
                        }
                    }
                }
            }
        }

        stage('Install & Build SDK') {
            steps {
                dir('core') {
                    sh 'npm install --legacy-peer-deps'
                    sh 'npm run build-lib'
                }
            }
        }

        stage('Publish to npm') {
            steps {
                dir('core') {
                    sh '''
                        echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
                        npm publish
                    '''
                }
            }
        }

        stage('Tag & GitHub Release') {
            steps {
                dir('core') {
                    script {
                        def version     = sh(script: "node -p \"require('./package.json').version\"", returnStdout: true).trim()
                        def tagName     = "v${version}"
                        def releaseName = "v${version}"

                        sh '''
                            git config user.name 'Ishaan Jain'
                            git config user.email 'ishaan.jain@likeminds.community'
                        '''

                        sh "git tag ${tagName}"

                        withCredentials([string(credentialsId: 'ISHAAN_GITHUB_TOKEN', variable: 'GITHUB_TOKEN')]) {
                            writeFile file: 'release_payload.json', text: """
                            {
                                "tag_name": "${tagName}",
                                "name": "${releaseName}",
                                "generate_release_notes": true,
                                "draft": false,
                                "prerelease": false
                            }
                            """

                            // push the tag securely & safely
                            sh """
                                git remote set-url origin https://\$GITHUB_TOKEN@github.com/${REPO}.git
                                git push origin refs/tags/${tagName}
                            """

                            // create the GitHub release
                            sh '''
                                curl -X POST https://api.github.com/repos/LikeMindsCommunity/likeminds-chat-reactjs/releases \
                                -H "Authorization: token $GITHUB_TOKEN" \
                                -H "Content-Type: application/json" \
                                -d @release_payload.json
                            '''
                        }

                        currentBuild.description = tagName
                    }
                }
            }
        }

        stage('Notify Slack') {
            steps {
                withCredentials([string(credentialsId: 'SLACK_TEST_JS_PIPELINE', variable: 'SLACK_WEBHOOK')]) {
                    script {
                        def version     = sh(script: "node -p \"require('./core/package.json').version\"", returnStdout: true).trim()
                        def branch      = env.GIT_BRANCH ?: 'unknown'
                        def buildNumber = env.BUILD_NUMBER
                        def jobName     = env.JOB_NAME
                        def timestamp   = (System.currentTimeMillis() / 1000)

                        def slackPayload = """
                            {
                                "attachments": [
                                    {
                                        "color": "#36a64f",
                                        "title": "✅ ReactJS Chat Core SDK Deployed",
                                        "title_link": "https://github.com/${REPO}/releases/tag/${version}",
                                        "text": "A new version of the React SDK has been deployed and released.",
                                        "fields": [
                                            { "title": "Version", "value": "${version}", "short": true },
                                            { "title": "Branch", "value": "${branch}", "short": true },
                                            { "title": "Build", "value": "#${buildNumber}", "short": true },
                                            { "title": "Job Name", "value": "${jobName}", "short": true }
                                        ],
                                        "footer": "Jenkins CI",
                                        "footer_icon": "https://jenkins.io/images/logos/jenkins/jenkins.png",
                                        "ts": ${timestamp}
                                    }
                                ]
                            }
                        """
                        writeFile file: 'slack_payload.json', text: slackPayload

                        sh '''
                            curl -X POST -H "Content-Type: application/json" \
                                --data @slack_payload.json $SLACK_WEBHOOK
                        '''
                    }
                }
            }
        }
    }
}
