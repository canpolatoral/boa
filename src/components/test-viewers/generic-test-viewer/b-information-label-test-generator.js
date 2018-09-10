import React from 'react';
var BInformationText = require('b-information-text').BInformationText;

var BCard = require('b-card').BCard;
export class BInfoLabelTestGenerator {

  generate(context, self) {
    return [
      {
        text: 'BAccountComponent',
        component: (
          <div className="row">
            <div className="col-xs-6">
              <div className="col-xs-6">
                <BCard context={context} expandable={false} initiallyExpanded={true} style={{width:'250px', height:'180px'}}  >
                  <BInformationText context={context}
                    labelWidth={100}
                    labelText="Kullanılabilir Bakiye"
                    infoText='190,50 TL' />
                  <BInformationText context={context}
                    labelWidth={100}
                    labelText="Bakiye"
                    infoText='190,50 TL' />
                  <BInformationText context={context}
                    labelWidth={100}
                    labelText="IBAN"
                    infoText='TR 20 1802 2800 9900 0060 1100 00' />

                </BCard>

              </div>

              <div className="col-xs-6">
                <BCard context={context} expandable={false} initiallyExpanded={true}  >
                  <BInformationText context={context}
                    labelWidth={100}
                    labelText="labelText"
                    infoText='infoText' />
                </BCard >
              </div>


            </div>

            <div className="col-xs-6">

              <BCard context={context} expandable={false} initiallyExpanded={true} style={{width:'500px', height:'200px'}} >
                <BInformationText context={context}
                    labelWidth={100}
                    isComplex={true}
                    complexHeader="İletişim Adresi"
                    complexInfotext={['Küplüce Mah. Ahmet Muhtarpaşa Sk. No:55  Üsküdar / iSTANBUL', 'Tebligat', 'Ekstre']}

                  />

              </BCard >
            </div>


            <div className="col-xs-6">

              <BCard context={context} expandable={false} initiallyExpanded={true} style={{width:'500px', height:'200px'}} >
                <BInformationText context={context}
                    labelWidth={100}
                    isComplex={true}
                    complexHeader="Highlighted Adresi"
                    highlightedText='(Teyitli)'
                    complexInfotext={['Küplüce Mah. Ahmet Muhtarpaşa Sk. No:55  Üsküdar / iSTANBUL', 'Tebligat', 'Ekstre']}
                    complexInfotextStyle={[{ fontWeight: 'bold' }]}
                  />
              </BCard >
            </div>

          </div>
        )
      },


    ];
  }
}
export default BInfoLabelTestGenerator;
