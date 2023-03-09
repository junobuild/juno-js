import {PostMessage} from "../types/post-message";
import {emit} from "../utils/events.utils";

let worker: Worker | undefined;

const idleSignOut = async (signOut: () => Promise<void>) => {
    emit({message: "junoSignOutIdleTimer"});
    await signOut();
}

export const startIdleTimer = async (signOut: () => Promise<void>) => {
    const content = await import('../workers/auth.worker');

    // @ts-ignore default is the base64 string representation of the script
    worker = new Worker(content.default);

    worker.onmessage = async ({ data }: MessageEvent<PostMessage>) => {
        const { msg } = data;

        switch (msg) {
            case 'junoSignOutIdleTimer':
                await idleSignOut(signOut);
                return;
        }
    };

    worker?.postMessage('junoStartIdleTimer');
};

export const stopIdleTimer = () => worker?.postMessage('junoStopIdleTimer');