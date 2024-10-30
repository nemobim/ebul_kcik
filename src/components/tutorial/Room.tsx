const Room = () => {
  const scripts = ['', '대사1', '대쇼ㅏ2', '대사3']
  return (
    <div className="h-full">
      {scripts.map((script, index) => (
        <div key={index} className="flex h-1/3 items-center justify-center">
          <div className="rounded-md bg-white p-5">{script}</div>
        </div>
      ))}
    </div>
  )
}

export default Room
