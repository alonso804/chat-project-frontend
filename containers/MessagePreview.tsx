import moment from "moment";
import { DATE_FORMAT } from "utils/constants";

interface MessagePreviewProps {
  username: string;
  message: string;
  date: Date;
}

const MessagePreview = ({ username, message, date }: MessagePreviewProps) => {
  return (
    <a href="#" className="bg-purple-400 flex w-full gap-2 mb-8">
      <div className="w-[15%] flex items-center justify-center">
        <div className="w-10 h-10 m-auto flex justify-center items-center bg-yellow-500 rounded-full relative">
          U
        </div>
      </div>
      <div className="w-[85%] flex justify-between">
        <div className="">
          <h3 className="text-red-300 font-semibold">{username}</h3>
          <p className="text-red-500">{message}</p>
        </div>
        <div className="bg-red-400">
          <h3 className="text-gray-500">{moment(date).format(DATE_FORMAT)}</h3>
        </div>
      </div>

      {/* <div className="w-[85%] flex justify-between">
        <div className="bg-purple-600 max-w-sm truncate">
          <h3 className="text-gray-300 font-semibold">{username}</h3>
          <p className="text-red-400 bg-yellow-500 truncate">
            {"Gollllllllllllllllllllllllllllllllllllllllllllllllll"}
          </p>
        </div>
        <div className="">
          <h3 className="text-gray-500">{moment(date).format(DATE_FORMAT)}</h3>
        </div>
      </div> */}
    </a>
  );
};

export default MessagePreview;
