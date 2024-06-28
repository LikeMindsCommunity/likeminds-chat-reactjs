function LMDmReqBlock() {
  return (
    <div className="dmReqBlock">
      <p>
        The sender has sent you a direct messaging request. Approve or respond
        with a message to get connected. Rejecting this request will not notify
        the sender.
      </p>
      <div className="dmActions">
        <button type="button">Approve</button>
        <button type="button">Reject</button>
      </div>
    </div>
  );
}

export default LMDmReqBlock;
