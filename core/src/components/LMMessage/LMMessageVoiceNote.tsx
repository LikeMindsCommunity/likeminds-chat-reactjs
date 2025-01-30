import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Attachment } from "../../types/models/Attachment";

export interface LMMessageVoiceNoteProps {
  attachment: Attachment;
}

export const LMMessageVoiceNote: React.FC<LMMessageVoiceNoteProps> = ({
  attachment,
}) => {
  const audio = useMemo(() => {
    const audioElement = new Audio(attachment.url);
    audioElement.addEventListener("ended", function () {
      setPlayState(false);
    });
    return audioElement;
  }, [attachment]);
  const timeToPercent = useCallback(
    (val: number) => {
      return (val / audio.duration) * 100;
    },
    [audio.duration],
  );
  const timeUpdate = useCallback(
    function () {
      rangeRef.current!.value = timeToPercent(audio.currentTime).toString();
      axisRef.current!.style.width = `calc(${timeToPercent(audio.currentTime)
        .toString()
        .concat("%")})`;
    },
    [audio.currentTime, timeToPercent],
  );
  const [playState, setPlayState] = useState<boolean>(false);

  const rangeRef = useRef<HTMLInputElement | null>(null);
  const axisRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (playState) {
      audio.addEventListener("timeupdate", timeUpdate);
      audio?.play();
    } else {
      audio?.pause();
      audio.removeEventListener("timeupdate", timeUpdate);
    }
  }, [audio, playState, timeUpdate]);
  return (
    <div>
      <AudioPlayer
        src={attachment.url}
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
      />
    </div>
  );
};
