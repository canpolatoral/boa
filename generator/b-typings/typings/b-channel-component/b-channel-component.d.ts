
declare namespace __BChannelComponent {
    interface BChannelComponentProps extends __BComponent.BComponentProps {

        isMultiple?: boolean;

        /**
        * 'channelId' or 'channelName' 
        */
        sortBy?: "channelId" | "channelName";

        /**
         * Determines the Channel that is currently selected.
         */
        selectedChannelId?: number;
        defaultSelectedChannelId?: number;

        selectedChannelIdList?: number[];
        defaultSelectedChannelIdList?: number[];

        /**
         * Filter the Channels by given channel Ids.
         */
        channelIdList?: number[];

        /**
         * If true an item will push to the first row of the Channel list. Default value is false.
         */
        isAllOptionIncluded?: boolean;

        /**
         * If isAllOptionIncluded is true. Default value is 'Hepsi'
         */
        allOptionDescription?: string;

        /**
         * If isAllOptionIncluded is true.. Default value is '-1'
         */
        allOptionValue?: any;

        /**
         * The hint content to display.
         */
        hintText?: string;

        /**
         * The content of the floating label.
         */
        labelText?: string;

        /**
         * Display the search input field top of the channel component.
         */
        disableSearch?: boolean;

        /**
         * If true; the Channel component will be disabled. Default valuse is false
         */
        disabled?: boolean;

        /**
         * Callback function fires when the channel has been selected.
         */
        onChannelSelect?: (selectedChannel: BOA.Common.Types.ChannelContext) => void;
    }

    interface BChannelComponentInstance extends __BComponent.BComponentInstance {
        /**
         * Returns the selected Channel
         */
        getValue(): BOA.Common.Types.ChannelContext;

        /**
         * Returns the list of channels
         */
        getValues: () => Array<BOA.Common.Types.ChannelContext>;

        /**
         * Load Channel data from data base
         * @param {any} callback (isSuccess: bool, value: any)
         */
        getChannelList: (callback: any) => void;

        /**
         * Set the Channels by your custom Channels
         * @param channelList
         * @param props
         */
        setValues: (channelList: number[]) => void;

        /**
         * Set the Channels by channel Ids
         * @param channelIdList
         * @param props
         */
        setValuesByIds: (channelIdList: number[]) => void;
        setSelectedChannelById: (channelId: number) => void;
        setSelectedChannelListByIdList: (channelIdList: number[]) => void;
        resetValue(): void;
    }

    export class BChannelComponent extends __BComponent.BComponetBase<BChannelComponentProps, BChannelComponentInstance> { }
}

declare module 'b-channel-component' {
    export import BChannelComponent = __BChannelComponent.BChannelComponent;
    export default BChannelComponent;
}