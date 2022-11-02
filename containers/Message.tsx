import moment from "moment";
import { DATE_FORMAT } from "utils/constants";

interface MessageProps {
  isSender: boolean;
  message: string;
  date: Date;
}
const Message = ({ isSender, message, date }: MessageProps) => {
  return (
    <div
      className={`flex
      ${isSender ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex flex-col gap-2 mb-2
        ${isSender ? "bg-purple-500" : "bg-[#292A30]"}
        ${isSender ? "text-right" : "text-left"}
        ${isSender ? "rounded-tl-lg" : "rounded-tr-lg"}
        py-2 px-4 rounded-br-lg rounded-bl-lg`}
      >
        <p className="text-white">{message}</p>
        <span className="text-gray-300">
          {moment(date).format(DATE_FORMAT)}
        </span>
      </div>
    </div>
  );
};

export default Message;
