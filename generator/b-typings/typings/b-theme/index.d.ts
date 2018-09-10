declare class BThemeProps {
    public appBar: Object;
    public avatar: Object;
    public badge: Object;
    public bottomNavigation: Object;
    public button: Object;
    public card: Object;
    public cardMedia: Object;
    public cardText: Object;
    public checkbox: Object;
    public chip: Object;
    public datePicker: Object;
    public dialog: Object;
    public dropDownMenu: Object;
    public enhancedButton: Object;
    public flatButton: Object;
    public floatingActionButton: Object;
    public gridTile: Object;
    public icon: Object;
    public inkBar: Object;
    public drawer: Object;
    public listItem: Object;
    public menu: Object;
    public menuItem: Object;
    public menuSubheader: Object;
    public overlay: Object;
    public paper: Object;
    public radioButton: Object;
    public raisedButton: Object;
    public refreshIndicator: Object;
    public ripple: Object;
    public slider: Object;
    public snackbar: Object;
    public subheader: Object;
    public stepper: Object;
    public svgIcon: Object;
    public table: Object;
    public tableFooter: Object;
    public tableHeader: Object;
    public tableHeaderColumn: Object;
    public tableRow: Object;
    public tableRowColumn: Object;
    public tabs: Object;
    public textField: Object;
    public timePicker: Object;
    public toggle: Object;
    public toolbar: Object;
    public tooltip: Object;
}


declare namespace BTheme {
    const getTheme: (object?: Object) => BThemeProps;
}

declare module "b-theme" {
    export = BTheme;
}