import React from 'react';

function InputFormularData (props:any) {

  function handleInputFormularChange (e: React.ChangeEvent<HTMLInputElement>) {
    const idx = Number(e.currentTarget.dataset.idx);
    const value = e.currentTarget.value;
    const type = e.currentTarget.type;

    let updatedInputFormularData = [...props.inputFormularData.formularData];
    let updatedInputFormular = {...props.inputFormularData}
    
    if (type === 'text' || type === 'radio')
      updatedInputFormularData[idx] = String(value);
    else if (type === 'number')
      updatedInputFormularData[idx] = Number(value);
    else if (type === 'checkbox')
      updatedInputFormularData[idx] = !updatedInputFormularData[idx];

    updatedInputFormular.formularData = updatedInputFormularData;
    console.log(updatedInputFormularData)
    props.setInputFormularData(updatedInputFormular);
  };

  return (
      props.inputFormularData.formularData.map((val: (string | boolean | number), idx: number) => {
        const label = props.inputFormularData.formularTemplate[idx].label;
        const inputStatus = props.inputFormularData.formularTemplate[idx].inputStatus;
        const inputType = props.inputFormularData.formularTemplate[idx].inputType;
        const radioButtonLabels = props.inputFormularData.formularTemplate[idx].radioButtonLabels;
        const value = props.inputFormularData.formularData[idx];
        const pattern = inputStatus === 'numeric' ? '[0-9]*' : inputStatus === 'mandatory' ? '.+' : '.*';

        return (
          <div key={`element-${idx}`} className='row-flex'>
            <div className='labelName'>
              {label}
              {inputStatus === 'mandatory' ? '*' : ''}
            </div>
            <div className='formularContent'>
              {
                inputType === 'textbox' &&
                <input
                  type={inputStatus === 'numeric' ? 'number' : 'text'}
                  name={`textbox-${idx}`}
                  placeholder={inputStatus=== 'numeric' ? 'Input only numbers' : inputStatus === 'mandatory' ? 'Mandatory' : ''}
                  data-idx={idx}
                  data-inputstatus={inputStatus}
                  key={`label-${idx}`}
                  className="textbox"
                  value={value}
                  required={inputStatus === 'mandatory' ? true : false}
                  onChange={handleInputFormularChange}
                />
              }
              {
                inputType === 'checkbox' &&
                <input
                  type="checkbox"
                  key={`label-${idx}`}
                  checked={Boolean(value)}
                  data-idx={idx}
                  className='checkbox'
                  onChange={handleInputFormularChange} />
              }
              {
                inputType === 'radio-buttons' && (
                  <div className='radioButtons'>
                    {radioButtonLabels.map((val: string, rblidx: number) => {
                      return (
                        <label>
                          <input
                            type="radio"
                            name={`radioButtonLabels-${idx}`}
                            data-idx={idx}
                            data-rblidx={rblidx}
                            checked={value === radioButtonLabels[rblidx]}
                            onChange={handleInputFormularChange}
                            key={`radioButtonLabel-${idx}-${rblidx}`}
                            value={radioButtonLabels[rblidx]}
                            required={inputStatus === 'mandatory' ? true : false}
                          />
                          {radioButtonLabels[rblidx]}
                        </label>
                      )
                    })}
                  </div>)
              }
            </div>
          </div>
        )
      })
  )
}

export default InputFormularData