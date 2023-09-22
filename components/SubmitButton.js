import Loading from "./Loading";

// file: /components/SubmitButton.js
const SubmitButton = ({ onClick , loading }) => {
  return (
    <button type="submit" className="submit-button" disable={loading} onClick={onClick}>
      {!loading && "Vectorize"}
      {loading && <Loading />}
    </button>
  );
};

export default SubmitButton;
