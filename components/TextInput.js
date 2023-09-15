// file: /components/TextInput.js
const TextInput = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="text-input"
      placeholder={placeholder}
    />
  );
};

export default TextInput;