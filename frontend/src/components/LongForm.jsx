export const LongForm = ({lng, label, value, id}) => {
    return (
        <>
            <div className='fd-brk fd-long-par'>
                <label htmlFor={id}>{label}</label>
                <textarea name={id} id={id} value={value} className="fd-inp-ful fd-txtarea" onChange={lng} placeholder='Type here...' required />
            </div>
        </>
    );
}