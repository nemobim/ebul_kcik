import ErrorIcon from '../../assets/icon/error_icon.svg'

const Error = ({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 px-4">
      <img src={ErrorIcon} alt="에러 아이콘" className="mb-5 w-[5rem]" />
      <div className="text-center">
        <h3 className="animate-bounce font-extrabold text-main3">{title}</h3>
        <p className="mt-4 text-base text-gray-300">{text}</p>
      </div>
      {children}
    </div>
  )
}

export default Error
