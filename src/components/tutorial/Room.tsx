import roomImg from '../../assets/room.png'

const Room = ({ handleNextStep }: { handleNextStep: () => void }) => {
  return (
    <div className="relative flex h-screen items-center justify-center bg-black">
      <img src={roomImg} alt="문" className="relative opacity-25" />
      <i onClick={handleNextStep} className="ri-cursor-fill glow-animation absolute bottom-[22rem] right-[10rem] text-3xl"></i>
    </div>
  )
}

export default Room
