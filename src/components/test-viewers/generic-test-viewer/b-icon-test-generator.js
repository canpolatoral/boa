import React from 'react';
var Actions = require('b-icon').Actions;
var Add = require('b-icon').Actions.Add;
var Logos = require('b-icon').Logos;
var KTLogoOnlyOriginal = require('b-icon').Logos.KTLogoOnlyOriginal;
var KFHLogo = require('b-icon').Logos.KFHLogo;
var KFHLogoWhite = require('b-icon').Logos.KFHLogoWhite;
var Menus = require('b-icon').Menus;
var Customer360 = require('b-icon').Menus.Customer360;
var Others = require('b-icon').Others;
var User = require('b-icon').Others.User;
import ReactSVG from 'react-svg';

export class BIconGenerator {

  generate(context) {
    const color = context.theme.boaPalette.pri500;
    var list = [];
    for (let key in Actions) {
      const IconType = Actions[key];
      list.push({
        'text': 'Actions - '+key,
        'component': <IconType style={{ height: 64, width: 64 }} context={context} color={color}/>
      });
    }
    for (let key in Logos) {
      const IconType = Logos[key];
      list.push({
        'text': 'Logos - '+key,
        'component': <IconType style={{ height: 64, width: 64 }} context={context} color={color}/>
      });
    }
    for (let key in Menus) {
      const IconType = Menus[key];
      list.push({
        'text': 'Menus - '+key,
        'component': <IconType style={{ height: 64, width: 64 }} context={context} color={color}/>
      });
    }
    for (let key in Others) {
      const IconType = Others[key];
      list.push({
        'text': 'Others - '+key,
        'component': <IconType style={{ height: 64, width: 64 }} context={context} color={color}/>
      });
    }
    return [
      {
        'text': 'ReactSVG from URL',
        // 'component': <ReactSVG path="https://s.cdpn.io/3/kiwi.svg" />
        'component': <ReactSVG path="https://s.cdpn.io/3/kiwi.svg" svgStyle={{ width: 50, height:50, fill: '#ff0000' }} />
      },
      {
        'text': 'Manuel Action',
        'component': <Add style={{ height: 64, width: 64 }} context={context} color={color}/>
      },
      {
        'text': 'Manuel Logo',
        'component': <KTLogoOnlyOriginal style={{ height: 64, width: 64 }} context={context}/>
      },
      {
        'text': 'Manuel Logo',
        'component': <KFHLogo style={{ height: 64, width: 64 }} context={context}/>
      },
      {
        'text': 'Manuel Logo',
        'component': <KFHLogoWhite style={{ height: 64, width: 64 }} context={context}/>
      },
      {
        'text': 'Manuel Menu',
        'component': <Customer360 style={{ height: 64, width: 64 }} context={context} color={color}/>
      },
      {
        'text': 'Manuel Other',
        'component': <User style={{ height: 64, width: 64 }} context={context} color={color}/>
      }
    ].concat(list);
  }
}
export default BIconGenerator;
