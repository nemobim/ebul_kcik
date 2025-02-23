import { Link } from 'react-router-dom'
import marker from '../../assets/tutorial/room/mark.png'
import roomImg from '../../assets/tutorial/room/my_room.png'

const Room = ({ handleNextStep }: { handleNextStep: () => void }) => {
  return (
    <div className="relative flex h-full flex-col items-center justify-center">
      <div className="relative w-[90%]">
        <img src={roomImg} alt="방" className="w-full" />
        <button onClick={handleNextStep}>
          <img src={marker} alt="마커" className="animate-jump absolute right-[20%] top-[40%] w-[20%] max-w-[80px]" />
        </button>
      </div>
      <Link to="/game" className="btn main3 absolute bottom-[10%] right-[10%] font-semibold">
        {`SKIP >`}
      </Link>
    </div>
  )
}

export default Room
