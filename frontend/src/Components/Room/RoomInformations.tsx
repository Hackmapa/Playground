import { useNavigate } from "react-router-dom";
import { Room, TttRoom } from "../../Interfaces/Rooms";
import { User } from "../../Interfaces/User";
import { Log } from "../../Interfaces/Log";
import { dateToString, fullDateToString } from "../../utils/utils";

interface RoomInformationsProps {
  room: Room;
  readyPlayers: number;
}

export const RoomInformations = (props: RoomInformationsProps) => {
  const { room, readyPlayers } = props;

  const navigate = useNavigate();

  const getGameStatus = () => {
    if (room.started) {
      if (room.finished) {
        return "Partie terminée";
      } else {
        return "Partie en cours";
      }
    }

    return "Partie non commencée";
  };

  const getLogColor = (log: Log) => {
    switch (log.type) {
      case "info":
        return "text-blue-400";
      case "start":
        return "text-red-400";
      case "create":
        return "text-yellow-400";
      case "leave":
        return "text-green-400";
      case "join":
        return "text-green-400";
      case "move":
        return "text-white";
      case "end":
        return "text-red-400";
      default:
        return "text-white";
    }
  };

  return (
    <div className="w-1/6 bg-darkBlue-gray border-t-2 border-t-darkBlue-dark h-[calc(100vh-72px)]">
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col">
          <div className="bg-darkBlue-gray px-4 py-4 h-full">
            <div className="p-4 rounded-xl bg-darkBlue">
              {room.players.length !== room.maxPlayers && (
                <h3 className="mt-6">
                  En attente de joueurs ... ({room.players.length}/
                  {room.maxPlayers})
                </h3>
              )}
              {room.players.length === room.maxPlayers && (
                <h2 className="flex items-center gap-3 text-2l text-white font-bold">
                  Joueurs ({readyPlayers}/{room.players.length} prêts)
                </h2>
              )}
              {room &&
                room.players.map((player: User) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between mx-auto mt-4 w-full hover:cursor-pointer"
                    onClick={() => navigate(`/profile/${player.id}`)}
                  >
                    <div className="flex gap-4">
                      <img
                        src={player.profile_picture}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <p className="text-lg cursor-pointer" key={player.id}>
                        {player.username}
                      </p>
                    </div>

                    <div className="mx-2 text-right">
                      <p className="text-center">
                        ({player.ready ? "Prêt" : "Pas prêt"})
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className=" bg-darkBlue mx-4 p-4 rounded-xl">
          <h3 className="text-left text-xl font-bold">
            Informations sur la partie :{" "}
          </h3>
          <div className="text-left flex flex-col gap-4 mt-4">
            {room && room.name && (
              <p>
                {" "}
                <span className="font-bold"> Nom: </span>
                {room.name}
              </p>
            )}
            <p className="mr-2">
              <span className="font-bold"> Statut: </span>
              {room && getGameStatus()}
            </p>
            {room && room.finished && (
              <p>
                {room.winner.user ? (
                  <>
                    <span className="font-bold">Gagnant: </span>
                    {room.winner.user?.username}
                  </>
                ) : (
                  <span className="font-bold">Match nul</span>
                )}
              </p>
            )}

            {room && room.moves && room.moves.length > 0 && (
              <p>
                <span className="font-bold">Nombre de coups: </span>
                {room.turn}
              </p>
            )}
          </div>
        </div>

        <div className="h-96 px-4 py-4 bg-darkBlue">
          <h3 className="text-xl font-bold">Logs : </h3>
          <div className="text-left flex  gap-4 mt-4 py-4 px-3 bg-darkBlue-gray rounded-xl h-72 overflow-auto scroll flex-col-reverse">
            {room &&
              room.logs &&
              room.logs
                .map((log: Log, index: number) => (
                  <div key={index} className="">
                    <p className="text-xs text-gray-200">
                      {fullDateToString(log.createdAt)}
                    </p>
                    <p className={`${getLogColor(log)} text-lg`}>
                      {log.message}
                    </p>
                  </div>
                ))
                .reverse()}
          </div>
        </div>
      </div>
    </div>
  );
};
