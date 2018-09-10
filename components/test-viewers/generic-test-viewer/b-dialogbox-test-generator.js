import React from 'react';
import { BDialogHelper } from 'b-dialog-box';
import { BButton } from 'b-button';
import { BComponent, BComponentComposer } from 'b-component';
import { BCheckBox } from 'b-check-box';

let isModal = false;

@BComponentComposer
export class BDialogBoxTestGenerator {


  static context;

  onClick(type) {

    let obj = {
      mainContent: 'Müşteriye ait aşağıda belirtilen eksik belgelerin yeni versiyonlarının eklenmesi gerekmektedir.',
      subcontents: [
        {
          header: 'Defne Kaymakçıgil için gerekli belgeler:',
          contents: ['Müşteri Kimlik', 'Müşteri Fotoğrafı', 'Müşteri İmza']
        },
        {
          header: 'Ezel Helvacıgil için gerekli belgeler:',
          contents: ['Müşteri Kimlik', 'Müşteri Fotoğrafı', 'Müşteri İmza']
        },
        {
          header: 'Rüya Şekercigil için gerekli belgeler:',
          contents: ['Müşteri Kimlik', 'Müşteri Fotoğrafı', 'Müşteri İmza']
        },
        {
          header: 'Rüya Şekercigil için gerekli belgeler:',
          contents: ['Müşteri Kimlik', 'Müşteri Fotoğrafı', 'Müşteri İmza']
        },
        {
          header: 'Rüya Şekercigil için gerekli belgeler:',
          contents: ['Müşteri Kimlik', 'Müşteri Fotoğrafı', 'Müşteri İmza']
        }
      ],
    };

    let stringText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit';

    let arrayText = ['Ahmet', 'Süleyman', 'Mehmet', 'Mustafa'];

    let result = [];
    result.push({ errorMessage: 'Deneme 123' });
    result.push({ errorMessage: 'Deneme 456' });
    result.push({ errorMessage: 'Deneme 789' });

    switch (type) {
      case 1:
        BDialogHelper.show(this.context,
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          BComponent.DialogType.WARNING,
          BComponent.DialogResponseStyle.OK,
          'Deneme Title',
          null,
          null,
          null,
          null,
          isModal
        );
        break;
      case 2:
        BDialogHelper.show(this.context,
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          BComponent.DialogType.SUCCESS,
          BComponent.DialogResponseStyle.OK,
          'Deneme Title',
          null,
          null,
          null,
          null,
          isModal
        );
        break;

      case 3:
        BDialogHelper.show(this.context,
          stringText,
          BComponent.DialogType.SUCCESS,
          BComponent.DialogResponseStyle.OK,
          'Deneme Title',
          null,
          null,
          null,
          null,
          isModal
        );
        break;

      case 4:
        BDialogHelper.show(this.context,
          arrayText,
          BComponent.DialogType.WARNING,
          BComponent.DialogResponseStyle.OK,
          'Deneme Title',
          null,
          null,
          null,
          null,
          isModal
        );
        break;
      case 5:
        BDialogHelper.show(this.context,
          obj,
          BComponent.DialogType.ERROR,
          BComponent.DialogResponseStyle.OK,
          'Deneme Title',
          null,
          null,
          null,
          null,
          isModal
        );
        break;
      case 6:
        BDialogHelper.show(this.context,
          <BButton context={this.context} type="raised"
            text={'Open Dialog'}
            onClick={this.onClick.bind(this, 7)} />,
          BComponent.DialogType.ERROR,
          BComponent.DialogResponseStyle.OK,
          'Test Title',
          null,
          null,
          null,
          null,
          isModal
        );
        break;
      case 7:
        BDialogHelper.show(this.context,
          <div>Test</div>,
          BComponent.DialogType.ERROR,
          BComponent.DialogResponseStyle.OK,
          'Test Title',
          null,
          null,
          null,
          null,
          true
        );
        break;
      case 8:
        BDialogHelper.showError(this.context,
          null,
          result,
          BComponent.DialogResponseStyle.OK,
          'Error Title',
          null,
          null,
          null,
          null,
          true
        );
        break;
        case 9:
        BDialogHelper.show(this.context,
          'Lorem ipsum dolor sit amet.\n consectetur adipiscing elit.',
          BComponent.DialogType.SUCCESS,
          BComponent.DialogResponseStyle.OK,
          'Deneme Title',
          null,
          null,
          null,
          null,
          isModal
        );
        break;
      default:
        break;
    }
  }

  onModalCheck = (event, isInputChecked) => {
    isModal = isInputChecked;
  };

  generate(context) {

    this.context = context;

    return [
      {
        'text': 'Is Modal?',
        'component': <BCheckBox context={context}
          label={'Is Modal'}
          defaultChecked={true}
          onCheck={this.onModalCheck}
        />
      },
      {
        'text': 'Single Line',
        'component': <BButton context={context} type="raised"
          text={'Single Line'}
          onClick={this.onClick.bind(this, 1)} />
      },
      {
        'text': 'Double Line',
        'component': <BButton context={context} type="raised"
          text={'Double Line'}
          onClick={this.onClick.bind(this, 2)} />
      },
      {
        'text': 'Multiline',
        'component': <BButton context={context} type="raised"
          text={'Multiline Content'}
          onClick={this.onClick.bind(this, 3)} />
      },
      {
        'text': 'Array Content',
        'component': <BButton context={context} type="raised"
          text={'Array Content'}
          onClick={this.onClick.bind(this, 4)} />
      },
      {
        'text': 'Object Content',
        'component': <BButton context={context} type="raised"
          text={'Object Content'}
          onClick={this.onClick.bind(this, 5)} />
      },
      {
        'text': 'DialogForm In DialogForm',
        'component': <BButton context={context} type="raised"
          text={'DialogForm In DialogForm'}
          onClick={this.onClick.bind(this, 6)} />
      },
      {
        'text': 'Dialog Error',
        'component': <BButton context={context} type="raised"
          text={'Dialog Error'}
          onClick={this.onClick.bind(this, 8)} />
      },
      {
        'text': 'Width Slash n',
        'component': <BButton context={context} type="raised"
          text={'Width Slash n'}
          onClick={this.onClick.bind(this, 9)} />
      }
    ];
  }
}
export default BDialogBoxTestGenerator;
