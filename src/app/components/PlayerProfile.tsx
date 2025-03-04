import { FaCrown, FaUser } from "react-icons/fa";
interface PlayerProfileProps {
  name: string;
  avatarUrl: string;
  isActive?: boolean;
}
const PlayerProfile = ({
  name,
  avatarUrl,
  isActive = false,
}: PlayerProfileProps) => {
  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-lg ${
        isActive ? "bg-green-100 border border-green-300" : "bg-gray-100"
      }`}
    >
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          <FaUser className="w-5 h-5 text-gray-600" />
        </div>
        {isActive && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div>
        <p className="font-medium text-sm text-gray-800">{name}</p>
        <div className="flex items-center text-xs text-gray-500">
          <FaCrown className="w-3 h-3 ml-1 text-yellow-500" />
        </div>
      </div>
    </div>
  );
};
export default PlayerProfile;
