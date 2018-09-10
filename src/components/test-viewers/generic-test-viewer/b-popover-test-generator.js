import React from 'react';
var BPopover = require('b-popover').BPopover;
import BButton from 'b-button';
import { findDOMNode } from 'react-dom';
import { FormControl, FormLabel, FormControlLabel } from '@material-ui/core';
import {Radio, RadioGroup } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {Input, InputLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';

export class BPopoverTestGenerator {

  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    this.self.state = {
      open: false,
      anchorEl: null,
      anchorOriginVertical: 'bottom',
      anchorOriginHorizontal: 'center',
      transformOriginVertical: 'top',
      transformOriginHorizontal: 'center',
      positionTop: 200, // Just so the popover can be spotted more easily
      positionLeft: 400, // Same as above
      anchorReference: 'anchorEl',
      menuAnchorEl: null,
      transitionDuration: 500,
    };
  }

  onClick() {
    this.self.setState({ open: true, anchorEl: findDOMNode(this.button), menuAnchorEl: findDOMNode(this.popover) });
  }

  handleClose() {
    this.self.setState({ open: false });
  }

  handleChange = key => (event, value) => {
    this.self.setState({
      [key]: value,
    });
  };

  handleNumberInputChange = key => event => {
    this.self.setState({
      [key]: parseInt(event.target.value, 10),
    });
  };

  generate(context, self) {
    return [
      {
        'text': 'BPopover',
        'component':
  <div>
    {/* <BButton ref={node => {this.button = node;}} context={context} type="raised"
      text={'Popover'}
      onClick={this.onClick.bind(this)}>
    </BButton> */}
    <Button
      ref={node => {this.button = node;}}
      variant="raised"
      onClick={this.onClick.bind(this)}>
      Open Popover
    </Button>

    <BPopover ref={node => {this.popover = node;}}
        context = {context}
        open={this.self.state.open}
        anchorEl={this.self.state.anchorEl}
        anchorReference={this.self.state.anchorReference}
        anchorPosition={{ top: this.self.state.positionTop, left: this.self.state.positionLeft }}
        onRequestClose={this.handleClose.bind(this)}
        anchorOrigin={{
          vertical: this.self.state.anchorOriginVertical,
          horizontal: this.self.state.anchorOriginHorizontal,
        }}
        transformOrigin={{
          vertical: this.self.state.transformOriginVertical,
          horizontal: this.self.state.transformOriginHorizontal,
        }}
        transitionDuration={this.self.state.transitionDuration}>
      <div>
        <BButton context={context} type="flat"
                text={'Popover1'}
                onClick={this.handleClose.bind(this)} />
        <br />
        <BButton context={context} type="flat"
                text={'Popover2'}
                onClick={this.handleClose.bind(this)} />
        <br />
        <BButton context={context} type="flat"
                text={'Popover3'}
                onClick={this.handleClose.bind(this)} />
        <br />
        <BButton context={context} type="flat"
                text={'Popover4'}
                onClick={this.handleClose.bind(this)} />
      </div>
    </BPopover>

    <Grid container style={{marginTop: '50px'}}>
      <Grid item xs={12} sm={6}>
        <FormControl component="fieldset">
          <FormLabel component="legend">anchorReference</FormLabel>
          <RadioGroup
            row
            aria-label="anchorReference"
            name="anchorReference"
            value={this.self.state.anchorReference}
            onChange={this.handleChange('anchorReference')}
          >
            <FormControlLabel value="anchorEl" control={<Radio />} label="anchorEl" />
            <FormControlLabel value="anchorPosition" control={<Radio />}
              label="anchorPosition"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl>
          <InputLabel htmlFor="position-top">anchorPosition.top</InputLabel>
          <Input
            id="position-top"
            type="number"
            value={this.self.state.positionTop}
            onChange={this.handleNumberInputChange('positionTop')}
          />
        </FormControl>
        &nbsp;
        <FormControl>
          <InputLabel htmlFor="position-left">anchorPosition.left</InputLabel>
          <Input
            id="position-left"
            type="number"
            value={this.self.state.positionLeft}
            onChange={this.handleNumberInputChange('positionLeft')}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl component="fieldset">
          <FormLabel component="legend">anchorOrigin.vertical</FormLabel>
          <RadioGroup
            aria-label="anchorOriginVertical"
            name="anchorOriginVertical"
            value={this.self.state.anchorOriginVertical}
            onChange={this.handleChange('anchorOriginVertical')}
          >
            <FormControlLabel value="top" control={<Radio />} label="Top" />
            <FormControlLabel value="center" control={<Radio />} label="Center" />
            <FormControlLabel value="bottom" control={<Radio />} label="Bottom" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl component="fieldset">
          <FormLabel component="legend">transformOrigin.vertical</FormLabel>
          <RadioGroup
            aria-label="transformOriginVertical"
            name="transformOriginVertical"
            value={this.self.state.transformOriginVertical}
            onChange={this.handleChange('transformOriginVertical')}
          >
            <FormControlLabel value="top" control={<Radio />} label="Top" />
            <FormControlLabel value="center" control={<Radio />} label="Center" />
            <FormControlLabel value="bottom" control={<Radio />} label="Bottom" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl component="fieldset">
          <FormLabel component="legend">anchorOrigin.horizontal</FormLabel>
          <RadioGroup
            row
            aria-label="anchorOriginHorizontal"
            name="anchorOriginHorizontal"
            value={this.self.state.anchorOriginHorizontal}
            onChange={this.handleChange('anchorOriginHorizontal')}
          >
            <FormControlLabel value="left" control={<Radio />} label="Left" />
            <FormControlLabel value="center" control={<Radio />} label="Center" />
            <FormControlLabel value="right" control={<Radio />} label="Right" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl component="fieldset">
          <FormLabel component="legend">transformOrigin.horizontal</FormLabel>
          <RadioGroup
            row
            aria-label="transformOriginHorizontal"
            name="transformOriginHorizontal"
            value={this.self.state.transformOriginHorizontal}
            onChange={this.handleChange('transformOriginHorizontal')}
          >
            <FormControlLabel value="left" control={<Radio />} label="Left" />
            <FormControlLabel value="center" control={<Radio />} label="Center" />
            <FormControlLabel value="right" control={<Radio />} label="Right" />
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl component="fieldset">
          <InputLabel htmlFor="transition-duration">transitionDuration</InputLabel>
          <Input
            id="transition-duration"
            type="number"
            value={this.self.state.transitionDuration}
            onChange={this.handleNumberInputChange('transitionDuration')}
          />

        </FormControl>
      </Grid>
    </Grid>
  </div>
      }
    ];
  }
}
export default BPopoverTestGenerator;
