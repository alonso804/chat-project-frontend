import moment from "moment";
import { DATE_FORMAT } from "utils/constants";

interface MessagePreviewProps {
  username: string;
  message: string;
  date: Date;
  selected?: boolean;
}

const MessagePreview = ({
  username,
  message,
  date,
  selected = false,
}: MessagePreviewProps) => {
  return (
    <a
      href="#"
      className={`flex justify-between w-full mt-4 ${
        selected ? "border-l-2 pl-4" : "pl-5"
      }`}
    >
      <div className=" w-[70%]">
        <h3 className="font-semibold truncate">{username}</h3>
        <p className="text-gray-500 truncate">{message}</p>
      </div>
      <p className="text-right text-gray-500 w-[30%]">
        {moment(date).format(DATE_FORMAT)}
      </p>
    </a>
  );
};

export default MessagePreview;
