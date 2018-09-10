
declare namespace __BCaptcha {
    interface BCaptchaProps extends __BComponent.BComponentProps {
        sitekey: string;
        grecaptcha?: any;
        theme?: 'dark' | 'light';
        type?: 'image' | 'audio';
        tabindex?: number;
        //size?: 'compact' | 'normal' | 'invisible';
        stoken?: string;
        badge?: 'bottomright' | 'bottomleft' | 'inline';
        style?: object;

        onChange?: (token: string) => void;
        onExpired?: () => void;
		
    }

    interface BCaptchaInstance extends __BComponent.BComponentInstance {
        reset(): void;
        getValue(): void;
    }

    export class BCaptcha extends __BComponent.BComponetBase<BCaptchaProps, BCaptchaInstance> { }
}

declare module 'b-captcha' {
     export import BCaptcha = __BCaptcha.BCaptcha;
    export default BCaptcha;
}