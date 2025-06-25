export const DoubleInpForm = (
    {fn, ln}
) => {
    return (
        <>
            <div className='fd-brk fd-nm'>
                <label>Name</label>
                <div  className='fd-nm-inp'>
                    <input type="text" name='fd-fnm' id='namefield' className="fd-inp-ful" placeholder='First Name' onChange={fn} required/>
                    <input type="text" name='fd-lnm' id='namefield' className="fd-inp-ful" placeholder='Last Name' onChange={ln} required/>
                </div>
            </div>
        </>
    );
}

export default DoubleInpForm;