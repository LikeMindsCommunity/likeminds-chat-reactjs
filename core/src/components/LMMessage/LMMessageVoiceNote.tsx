import { useEffect, useMemo, useRef, useState } from "react";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Attachment } from "../../types/models/Attachment";
import { CustomActions } from "../../customActions";

export interface LMMessageVoiceNoteProps {
  attachment: Attachment;
}

export const LMMessageVoiceNote: React.FC<LMMessageVoiceNoteProps> = ({
  attachment,
}) => {
  const [playState, setPlayState] = useState<boolean>(false);

  const audio = useMemo(() => {
    const audioElement = new Audio(attachment.url);
    audioElement.addEventListener("ended", function () {
      setPlayState(false);
    });
    return audioElement;
  }, [attachment.url]);

  const rangeRef = useRef<HTMLInputElement | null>(null);
  const axisRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeToPercent = (val: number) => {
      return (val / audio.duration) * 100;
    };

    const timeUpdate = () => {
      rangeRef.current!.value = timeToPercent(audio.currentTime).toString();
      axisRef.current!.style.width = `calc(${timeToPercent(audio.currentTime)
        .toString()
        .concat("%")})`;
    };
    if (playState) {
      audio.addEventListener("timeupdate", timeUpdate);
      // audio?.play();
    } else {
      // audio?.pause();
      audio.removeEventListener("timeupdate", timeUpdate);
    }
  }, [audio, playState]);

  // useEffect(() => {
  //   if (playState) {
  //     document.dispatchEvent(
  //       new CustomEvent(CustomActions.VOICE_NOTE_PLAYED, {
  //         detail: { fileName: attachment.name },
  //       }),
  //     );
  //   }
  // }, [attachment.name, playState]);

  useEffect(() => {
    const onPlayOrPauseUpdateHandler = (event: Event) => {
      const currentPlayedFileName = (event as CustomEvent).detail.fileName;
      console.log("currentPlayedFileName", currentPlayedFileName);
      if (currentPlayedFileName !== attachment.name) {
        if (playState) {
          console.log("The audio is not the same as the current audio");
          audio.pause();
          audio.currentTime = 0;
          setPlayState(false);
        }
      }
    };

    document.addEventListener(
      CustomActions.VOICE_NOTE_PLAYED,
      onPlayOrPauseUpdateHandler,
    );
    return () => {
      document.removeEventListener(
        CustomActions.VOICE_NOTE_PLAYED,
        onPlayOrPauseUpdateHandler,
      );
    };
  }, [attachment.name, audio, playState]);

  return (
    <div>
      <AudioPlayer
        src={attachment.fileUrl}
        volume={0.5}
        customControlsSection={[RHAP_UI.MAIN_CONTROLS]}
        layout={"horizontal-reverse"}
        showJumpControls={false}
        customProgressBarSection={[RHAP_UI.PROGRESS_BAR]}
        showDownloadProgress={false}
        customIcons={{
          play: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="20"
              viewBox="0 0 16 20"
              fill="none"
              style={{
                marginLeft: "4px",
              }}
            >
              <path
                d="M0.75 0.8125V19.1875L15.1875 10L0.75 0.8125Z"
                fill="white"
              />
            </svg>
          ),
          pause: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="15"
              viewBox="0 0 12 15"
              fill="none"
            >
              <path
                d="M1.38197 14.7168H3.4474C4.28236 14.7168 4.71302 14.2861 4.71302 13.4512V1.35742C4.71302 0.504883 4.28236 0.100586 3.4474 0.0917969H1.38197C0.547007 0.0917969 0.116343 0.522461 0.116343 1.35742V13.4512C0.107554 14.2861 0.538218 14.7168 1.38197 14.7168ZM8.06166 14.7168H10.1183C10.9533 14.7168 11.3839 14.2861 11.3839 13.4512V1.35742C11.3839 0.504883 10.9533 0.0917969 10.1183 0.0917969H8.06166C7.21791 0.0917969 6.79603 0.522461 6.79603 1.35742V13.4512C6.79603 14.2861 7.21791 14.7168 8.06166 14.7168Z"
                fill="white"
              />
            </svg>
          ),
        }}
        onPlay={() => {
          console.log("onPlay");
          console.log(attachment.name);

          document.dispatchEvent(
            new CustomEvent(CustomActions.VOICE_NOTE_PLAYED, {
              detail: { fileName: attachment.name },
            }),
          );
          setPlayState(true);
        }}
        onPause={() => {
          console.log("onPause");
          setPlayState(false);
        }}
        onEnded={() => {
          console.log("onEnded");
          setPlayState(false);
        }}
      />
    </div>
  );
};
