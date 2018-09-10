import React from 'react';
import BInput from 'b-input';


export class BInputTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    self.state.helperTextInput = {
      hint: 'Customer Id',
      label: ' '
    };
    this.disabled = false;
  }

  helperTextInput_OnChange(e) {
    let value = e.target.value;
    let hasValue = value && value.length > 0;
    let hint = this.self.state.helperTextInput.hint;
    this.self.setState({
      helperTextInput: {
        hint: hint,
        label: hasValue ? hint : ' '
      }
    });
  }

  onTimerFinished() {
    console.log('Süre bitti');
  }

  _btnDisableOnclick(e) {
    this.disabled = !this.disabled;
    this.CounterText.getInstance().setDisable(this.disabled);
  }

  _btnValidateOnclick(e) {
    this.constraintEditor && this.constraintEditor.getInstance().validateConstraint();
  }

  generate(context, self) {
    return [
      {
        'text': 'Timer',
        'component':
  <div>
    <div style={{ marginBottom: '10px' }}>
      <BInput context={context}
              defaultValue="1234"
              timerDuration={10}
              maxLength={10}
              showCounter={true}
              onTimerFinished={this.onTimerFinished}
              style={{ marginRight: '10px' }}
              onChange={(e, v)=>{
                console.log(v);
              }}
            />
    </div>
  </div>
      },
      {
        'text': 'Counter Text',
        'component':
  <div>
    <div style={{ marginBottom: '10px' }}>
      <BInput context={context}
              ref={(r) => this.CounterText = r}
              type="text"
              floatingLabelText='Floating'
              hintText='Hint'
              helperText="Helper"
              disabled={this.disabled}
              maxLength={23}
              style={{ marginRight: '10px' }}
              showCounter={true}
            />
      <button id="disable" onClick={this._btnDisableOnclick.bind(this)} style={{ marginLeft: '10px' }}>Disable/Editable</button>
    </div>
  </div>
      },
      {
        'text': 'Normal Text',
        'component':
  <div>
    <div style={{ marginBottom: '10px' }}>
      <BInput context={context}
              type="text"
              style={{ marginRight: '10px' }}
            />
    </div>
  </div>
      },
      {
        'text': 'Floating & No Hint',
        'component':
  <div>
    <div style={{ marginBottom: '10px' }}>
      <BInput context={context}
              type="text"
              floatingLabelText="Customer Id "
              style={{ marginRight: '10px' }}
            />
    </div>
  </div>
      },
      {
        'text': 'HelperText',
        'component':
  <div>
    <div style={{ marginBottom: '10px' }}>
      <BInput context={context}
              type="text"
              maxLength={8}
              showCounter={true}
              floatingLabelText={this.self.state.helperTextInput.label}
              floatingLabelFixed={true}
              hintText={this.self.state.helperTextInput.hint}
              helperText="Max 8 Characters"
              style={{ marginRight: '10px' }}
              onChange={this.helperTextInput_OnChange.bind(this)}
            />
    </div>
  </div>
      },
      {
        'text': 'Floating & Hint',
        'component':
  <div>
    <div style={{ marginBottom: '10px' }}>
      <BInput context={context}
              type="text"
              maxLength={8}
              showCounter={true}
              hintText="Max 8 characters"
              floatingLabelText="Customer Id"
              style={{ marginRight: '10px' }}
            />
    </div>
  </div>
      },
      {
        'text': 'Multi Line',
        'component': <div>
          <div style={{ marginBottom: '10px' }}>
            <BInput context={context}
              type="text"
              multiLine={true}
              rows={1}
              rowsMax={4}
              noWrap={false}
              hintText="Multiline Text"
              floatingLabelText="Description Box"
              style={{ marginRight: '10px' }}
            />
          </div>
        </div>
      },
      {
        'text': 'Floating & Hint & Error',
        'component': <div>
          <div style={{ marginBottom: '10px' }}>
            <BInput context={context}
              hintText="012345678910"
              floatingLabelText="TC National Id Number"
              errorText="Please enter 11 digit TC National Id Number"
              style={{ marginRight: '10px' }}
            />
          </div>
        </div>
      },
      {
        'text': 'Hidden',
        'component': <div>
          <div style={{ marginBottom: '10px' }}>
            <BInput context={context}
              visibility="hidden"
              hintText="012345678910"
              floatingLabelText="TC National Id Number"
              errorText="Please enter 11 digit TC National Id Number"
              style={{ marginRight: '10px' }}
            />
          </div>
        </div>
      },
      {
        'text': 'Disabled',
        'component': <div>
          <div style={{ marginBottom: '10px' }}>
            <BInput context={context}
              disabled={true}
              defaultValue="012345678901"
              hintText="012345678910"
              floatingLabelText="TC National Id Number"
              errorText="Please enter 11 digit TC National Id Number"
              style={{ marginRight: '10px' }}
            />
          </div>
        </div>
      },
      {
        'text': 'Value Constraint',
        'component': <div>
          <div style={{ marginBottom: '10px' }}>
            <BInput context={context}
              ref={(r) => this.constraintEditor = r}
              disabled={this.disabled}
              valueConstraint={{ required: true, minLength: 4, maxLength: 10 }}
              defaultValue="012345678901"
              hintText="TC National Id"
              floatingLabelText="TC National Id Number"
              style={{ marginRight: '10px' }}
            />
            <button id="validate" onClick={this._btnValidateOnclick.bind(this)} style={{ marginLeft: '10px' }}>Validate</button>
          </div>
        </div>
      },
      {
        'text': 'DefaultValue',
        'component': <div>
          <div style={{ marginBottom: '10px' }}>
            <BInput context={context}
              defaultValue="1234"
              maxLength={10}
              showCounter={true}
              style={{ marginRight: '10px' }}
            />
          </div>
        </div>
      },
      {
        'text': 'BottomRightInfo',
        'component': <div>
          <div style={{ marginBottom: '10px' }}>
            <BInput context={context}
              defaultValue="1234"
              maxLength={10}
              showCounter={true}
              bottomRightInfo="03:00"
              style={{ marginRight: '10px' }}
            />
          </div>
        </div>
      },
      {
        'text': 'All Field',
        'component': <div>
          <div style={{ marginBottom: '10px' }}>
            <BInput context={context}

              helperText='_helperText'
              hintText='hintText'
              floatingLabelText='floatingLabelText'
              style={{ marginRight: '10px' }}
            />
          </div>
        </div>
      },
      {
        'text': 'Prefix - Suffix',
        'component': <div>
          <div style={{ marginBottom: '10px' }}>
            <BInput context={context}
              helperText='_helperText'
              hintText='hintText'
              floatingLabelText='floatingLabelText'
              prefixText='pre'
              suffixText='suf'
              style={{ marginRight: '10px' }}
            />
          </div>
        </div>
      }
    ];
  }
}
export default BInputTestGenerator;
