export const PositionSelect = ({label, id, onChange, value, optionList = []}) => {
    return (
        <div className="fd-brk fd-nm">
            <label htmlFor={id}>{label}</label>
            <select name={id} id={id} style={{color:"black"}} className="fd-inp-ful" onChange={onChange} defaultValue={value || ""} required>
                <option style={{color:"#3f3f3f"}} disabled value=""> --- Select your {label} ---</option>
                {
                    optionList.map((opt, idx) => ( 
                        <option key={idx} value={opt.value} style={{color:"#3f3f3f"}}>
                            {opt.label}
                        </option>
                    ))
                }
            </select>
        </div> 
    )
}

export default PositionSelect;