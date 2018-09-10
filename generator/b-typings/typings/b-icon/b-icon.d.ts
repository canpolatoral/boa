
declare namespace __BIcon {
    interface BIconProp extends __BComponent.BComponentProps {
        style?: React.CSSProperties;
        nativeColor?: string;
    }

    export class Icon extends __BComponent.BComponetBase<BIconProp> {
    }

    export class BIcon {
        static getIcon(cmpProps: any): any;
    }
}

declare namespace __Actions {
    export class Add extends __BIcon.Icon { }
    export class ArrowDownward extends __BIcon.Icon { }
    export class ArrowLeft extends __BIcon.Icon { }
    export class ArrowRight extends __BIcon.Icon { }
    export class ArrowUpward extends __BIcon.Icon { }
    export class Attachment extends __BIcon.Icon { }
    export class Chat extends __BIcon.Icon { }
    export class ContentCopy extends __BIcon.Icon { }
    export class Create extends __BIcon.Icon { }
    export class Delete extends __BIcon.Icon { }
    export class DoNotDisturbAlt extends __BIcon.Icon { }
    export class DocumentAdd extends __BIcon.Icon { }
    export class DocumentRemove extends __BIcon.Icon { }
    export class DocumentTextGraph extends __BIcon.Icon { }
    export class Document extends __BIcon.Icon { }
    export class Done extends __BIcon.Icon { }
    export class DoubleChevronRight extends __BIcon.Icon { }
    export class FileDownload extends __BIcon.Icon { }
    export class FileUpload extends __BIcon.Icon { }
    export class FindInPage extends __BIcon.Icon { }
    export class Folder extends __BIcon.Icon { }
    export class InfoCircle extends __BIcon.Icon { }
    export class List extends __BIcon.Icon { }
    export class LockOpen extends __BIcon.Icon { }
    export class MailOutline extends __BIcon.Icon { }
    export class Map extends __BIcon.Icon { }
    export class None extends __BIcon.Icon { }
    export class PauseCircleFilled extends __BIcon.Icon { }
    export class Pin extends __BIcon.Icon { }
    export class PlayCircleFilled extends __BIcon.Icon { }
    export class Print extends __BIcon.Icon { }
    export class Redo extends __BIcon.Icon { }
    export class Refresh extends __BIcon.Icon { }
    export class RemoveCircle extends __BIcon.Icon { }
    export class Remove extends __BIcon.Icon { }
    export class Save extends __BIcon.Icon { }
    export class Search extends __BIcon.Icon { }
    export class SelectAll extends __BIcon.Icon { }
    export class SettingsBackupRestore extends __BIcon.Icon { }
    export class StopCircleFilled extends __BIcon.Icon { }
    export class Undo extends __BIcon.Icon { }
}

declare namespace __Logos {
    export class KTBTLogo extends __BIcon.Icon { }
    export class BOALogo extends __BIcon.Icon { }
    export class KTLogoOnlyOriginal extends __BIcon.Icon { }
    export class KTLogoWhite extends __BIcon.Icon { }
    export class KFHLogo extends __BIcon.Icon { }
    export class KFHLogoWhite extends __BIcon.Icon { }
}

declare namespace __Menus {
    export class Accessibility extends __BIcon.Icon { }
    export class AccountBalance extends __BIcon.Icon { }
    export class AccountCircle extends __BIcon.Icon { }
    export class Banknote extends __BIcon.Icon { }
    export class BusinessCenter extends __BIcon.Icon { }
    export class Customer360 extends __BIcon.Icon { }
    export class Dashboard extends __BIcon.Icon { }
    export class DeviceHub extends __BIcon.Icon { }
    export class DevicesOther extends __BIcon.Icon { }
    export class Exposure extends __BIcon.Icon { }
    export class FeatherPen extends __BIcon.Icon { }
    export class HeadsetMic extends __BIcon.Icon { }
    export class Home extends __BIcon.Icon { }
    export class InsertChart extends __BIcon.Icon { }
    export class Language extends __BIcon.Icon { }
    export class LocationCity extends __BIcon.Icon { }
    export class Public extends __BIcon.Icon { }
    export class ShoppingCart extends __BIcon.Icon { }
    export class Toll extends __BIcon.Icon { }
    export class TrackChanges extends __BIcon.Icon { }
    export class Umbrella extends __BIcon.Icon { }
    export class VerifiedUse extends __BIcon.Icon { }
}

declare namespace __Others {
    export class ChevronLeft extends __BIcon.Icon { }
    export class ChevronRight extends __BIcon.Icon { }
    export class Criterias extends __BIcon.Icon { }
    export class Lock extends __BIcon.Icon { }
    export class Pin extends __BIcon.Icon { }
    export class Resizable extends __BIcon.Icon { }
    export class User extends __BIcon.Icon { }
}

declare module 'b-icon' {
    export import Logos = __Logos;
    export import Actions = __Actions;
    export import Menus = __Menus;
    export import Others = __Others;
    export import BIcon = __BIcon.BIcon;
    export default BIcon;
}