# LikeMinds Chat SDK for React

Drop-in chat for React web apps. Group chatrooms, 1:1 DMs, polls, voice notes, reactions and
moderation, with every component overridable.

[![npm](https://img.shields.io/npm/v/@likeminds.community/likeminds-chat-reactjs.svg)](https://www.npmjs.com/package/@likeminds.community/likeminds-chat-reactjs)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

**Docs:** https://docs.likeminds.io/

## What you get

Group chatrooms and 1:1 DMs with request, approve, reject, block and rate limits · emoji reactions ·
reply, edit, delete, multi-select · @-mentions · polls, including instant, deferred, multi-select,
anonymous and user-added options · voice notes · images, video, GIFs via Giphy, PDFs and documents ·
link previews · chatroom topics · search across chatrooms, conversations and members ·
explore and discover chatrooms · secret chatrooms and invites · report and moderation ·
push notifications · custom JSON widget messages.

Mobile-responsive below 768px.

## Install

```bash
npm install @likeminds.community/likeminds-chat-reactjs
```

This is the UI layer. It depends on the data layer, which handles auth, networking, realtime and
media upload:

```bash
npm install @likeminds.community/chat-js
```

Source for the data layer is at
[likeminds-chat-js-data](https://github.com/LikeMindsCommunity/likeminds-chat-js-data).

## Three product shapes

Chat ships in three shapes, selected by theme. Each has a runnable reference app in this repo:

| Directory | What it is |
|---|---|
| `core/` | The publishable SDK |
| `community-chat/` | Group chatrooms only |
| `networking-chat/` | 1:1 DMs only |
| `community-hybrid-chat/` | Both in one app, plus routing and custom-action examples |
| `ai-chatbot/` | Chat against an AI bot participant |
| `ai-chatbot-webflow-integration/` | The AI chatbot embedded in a Webflow site |

To run one:

```bash
cd community-chat
npm install
npm run dev
```

## Customising

The SDK ships roughly 40 exported components, 18 hooks and 12 contexts. Two override systems are
built in:

- **Custom components** - swap any rendered component for your own
- **Custom callbacks** - intercept an action, run your logic, then optionally call through

You do not need to fork the SDK to change behaviour. If you find something that cannot be overridden,
that is a bug worth reporting.

## Built on

React 18 · Vite 5 · MUI 5 · Firebase · AWS S3 and Cognito · emoji-mart · Giphy

## Contributing

See the org-wide [contributing guide](https://github.com/LikeMindsCommunity/.github/blob/main/.github/CONTRIBUTING.md).
Security issues go to **natesh@likeminds.community**, not the issue tracker.

## License

Apache 2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).

---

## A note on the Jenkinsfile

The `Jenkinsfile` in this repo is **retained for historical reference and is not operational**. The
Jenkins server it ran on was decommissioned in August 2026.

It performed a build-and-archive step that nothing downstream consumed. Publishing has always run
through the GitHub Actions workflows in `.github/workflows`, which are unaffected.
