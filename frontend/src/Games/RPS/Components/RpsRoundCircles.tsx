import { RpsRoom } from "../../../Interfaces/Rooms";

interface RpsRoundCirclesProps {
  room: RpsRoom;
}

export const RpsRoundCircles = (props: RpsRoundCirclesProps) => {
  const { room } = props;

  return (
    <div className="flex flex-col items-center mt-8">
      <p className="text-left text-xl font-bold">Manches : </p>
      <div className="flex w-1/2 justify-between mt-4">
        {room.roundWinners &&
          room.roundWinners.map((winner: any, index) => (
            <div key={index}>
              {winner && winner.id && (
                <div className="flex items-center gap-3 w-24 h-24 bg-darkBlue rounded-full">
                  <div className="flex justify-center items-center w-full">
                    <img
                      className="w-20 h-20 rounded-full"
                      src={winner.profile_picture}
                      alt=""
                    />
                  </div>
                </div>
              )}

              {!winner && (
                <div className="flex items-center gap-3 w-24 h-24 bg-darkBlue rounded-full"></div>
              )}

              {winner && winner === "draw" && (
                <div className="flex items-center gap-3 w-24 h-24 bg-darkBlue rounded-full">
                  <div className="flex justify-center items-center w-full">
                    <p className="text-2xl">X</p>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
