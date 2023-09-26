import "./Notice.scss";

type NoticeType = "warning" | "attention" | "info";

interface NoticeProps {
  type: NoticeType;
  message: string;
  className?: string;
}
function Notice({ type, message, className }: NoticeProps) {
  let noticeClassName = "";

  if (type === "warning") {
    noticeClassName = "warning-notice";
  } else if (type === "attention") {
    noticeClassName = "attention-notice";
  } else if (type === "info") {
    noticeClassName = "info-notice";
  }

  if (className) {
    noticeClassName += " " + className;
  }

  return <div className={noticeClassName}>{message}</div>;
}

export default Notice;
