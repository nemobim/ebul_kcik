import marker from '../../assets/tutorial/room/mark.png'
import roomImg from '../../assets/tutorial/room/my_room.png'

const Room = ({ handleNextStep }: { handleNextStep: () => void }) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="relative w-[90%]">
        <img src={roomImg} alt="방" className="w-full" />
        <button onClick={handleNextStep}>
          <img src={marker} alt="마커" className="animate-jump absolute right-[20%] top-[40%] w-[20%] max-w-[80px]" />
        </button>
      </div>
    </div>
  )
}

export default Room
