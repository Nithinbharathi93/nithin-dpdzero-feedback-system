export const SingleInpForm = ({ label, onChange, type, name, id, placeholder }) => {
  return (
    <div className='fd-brk fd-nm'>
      <label htmlFor={id}>{label}</label>
      <div className='fd-nm-inp'>
        <input type={type} name={name} id={id} className="fd-inp-ful" onChange={onChange} placeholder={placeholder} required />
      </div>
    </div>
  );
};

export default SingleInpForm;
