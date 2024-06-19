/* eslint-disable @typescript-eslint/no-unused-vars */
import useChatroomList from "../../hooks/useChatroomsList";
import searchIcon from "./../../assets/img/search.svg";

function LMChannelList() {
  const { dmChatroomList, groupChatroomsList, loadMoreDmChatrooms } =
    useChatroomList();

  console.log(groupChatroomsList);
  return (
    <div className="lm-channel-list">
      <div>
        <div className="lm-channel-list-header">
          <div className="title">Chatroom</div>
          <div className="icon">
            <img src={searchIcon} alt="searchIcon" />
          </div>
        </div>

        <div className="lm-channel-list-body">
          <div className="channel-media">
            <div className="channel-icon">
              <img src="https://placehold.co/400" alt="channel icon" />
            </div>
            <div className="channel-desc">
              <div className="channel-title">Simarn Kaur</div>
              <div className="channel-info">
                Direct messaging request received.
              </div>
            </div>
          </div>
          <div className="channel-media">
            <div className="channel-icon">
              <img src="https://placehold.co/400" alt="channel icon" />
            </div>
            <div className="channel-desc">
              <div className="channel-title">Bradley Thornton</div>
              <div className="channel-info">
                Direct message your community manager.
              </div>
            </div>
          </div>
          <div className="channel-media">
            <div className="channel-icon">
              <img src="https://placehold.co/400" alt="channel icon" />
            </div>
            <div className="channel-desc">
              <div className="channel-title">Sachin Gakkhar</div>
              <div className="channel-info">You: Can we connect sometime?</div>
            </div>
          </div>
          <div className="channel-media">
            <div className="channel-icon">
              <img src="https://placehold.co/400" alt="channel icon" />
            </div>
            <div className="channel-desc">
              <div className="channel-title">Winifred Price</div>
              <div className="channel-info">You: Can we connect sometime?</div>
            </div>
          </div>

          <div className="channel-media">
            <div className="channel-icon">
              <img src="https://placehold.co/400" alt="channel icon" />
            </div>
            <div className="channel-desc">
              <div className="channel-title">Simarn Kaur</div>
              <div className="channel-info">
                Direct messaging request received.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="lm-channel-list-header">
          <div className="title">Explore</div>
        </div>

        <div className="lm-channel-list-body">
          <div className="channel-media">
            <div className="channel-icon">
              <img src="https://placehold.co/400" alt="channel icon" />
            </div>
            <div className="channel-desc">
              <div className="channel-title">Simarn Kaur</div>
              <div className="channel-info">
                Direct messaging request received.
              </div>
            </div>
          </div>
          <div className="channel-media">
            <div className="channel-icon">
              <img src="https://placehold.co/400" alt="channel icon" />
            </div>
            <div className="channel-desc">
              <div className="channel-title">Bradley Thornton</div>
              <div className="channel-info">
                Direct message your community manager.
              </div>
            </div>
          </div>
          <div className="channel-media">
            <div className="channel-icon">
              <img src="https://placehold.co/400" alt="channel icon" />
            </div>
            <div className="channel-desc">
              <div className="channel-title">Sachin Gakkhar</div>
              <div className="channel-info">You: Can we connect sometime?</div>
            </div>
          </div>
          <div className="channel-media">
            <div className="channel-icon">
              <img src="https://placehold.co/400" alt="channel icon" />
            </div>
            <div className="channel-desc">
              <div className="channel-title">Winifred Price</div>
              <div className="channel-info">You: Can we connect sometime?</div>
            </div>
          </div>

          <div className="channel-media">
            <div className="channel-icon">
              <img src="https://placehold.co/400" alt="channel icon" />
            </div>
            <div className="channel-desc">
              <div className="channel-title">Simarn Kaur</div>
              <div className="channel-info">
                Direct messaging request received.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LMChannelList;
