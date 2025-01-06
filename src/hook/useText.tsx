// const Text = () => {
//     const [text, setText] = useState('')
//     return <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
// }

export const useText = () => {
  const [text, setText] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  return { text, handleChange }
}
