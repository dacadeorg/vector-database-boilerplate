// file: /components/SubmitButton.js
const SubmitButton = ({ onClick }) => {
  return (
    <button type="submit" className="submit-button" onClick={onClick}>
      Submit
    </button>
  );
};

export default SubmitButton;
