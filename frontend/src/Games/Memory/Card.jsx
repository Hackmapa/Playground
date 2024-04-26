//working of individual cards like the ability to toggle or flip and there design
//is carried out in this file
function Card({ item, handleSelectedCards, toggled, stopflip }) {
  return (
    <div className="item">
      <div className={toggled ? "toggled" : ""}>
        <img
          className={
            toggled
              ? "h-24 absolute transition-all duration-[ease-in] delay-[0.25s] [transform:rotateY(0deg)]"
              : "h-24 absolute transition-all duration-[ease-in] delay-[0.25s] [transform:rotateY(90deg)]"
          }
          src={item.img}
          alt="face"
        />
        <div
          className={
            toggled
              ? "h-24 w-24 bg-[rgb(253,218,175)] text-[rgb(61,21,21)] border rounded-xl border-solid border-[black] transition-all duration-[ease-in] delay-[0s] [transform:rotateY(90deg)]"
              : "h-24 w-24 bg-[rgb(253,218,175)] text-[rgb(61,21,21)] border rounded-xl border-solid border-[black] transition-all duration-[ease-in] delay-[0.25s]"
          }
          onClick={() => !stopflip && handleSelectedCards(item)}
        >
          {" "}
        </div>
      </div>
    </div>
  );
}

export default Card;
