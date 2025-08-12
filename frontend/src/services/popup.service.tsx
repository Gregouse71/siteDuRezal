import { atom, useRecoilState } from 'recoil';

export const statusPopup = atom({
    key : "statusPopup",
    default : "status"
})

export const messagePopup = atom({
    key : "messagePopup",
    default : ""
})

export const popupChanged = atom({
    key : "popupChanged",
    default : false
})

export default function usePopupService() {

    const [status, setStatus] = useRecoilState(statusPopup);
    const [message, setMessage] = useRecoilState(messagePopup);
    const [changed, setChanged] = useRecoilState(popupChanged);

    const changePopup = (newPopupInfo : any) => {
        setStatus(newPopupInfo.status);
        setMessage(newPopupInfo.message);
        setChanged(true);
    }

    const colorAccordingToSucessState = (statusState : string) => {
        switch(statusState) {
            case "success" : return "green";
            case "warning" : return "orange";
            case "error" : return "red";
            default : return "grey"
        }
    }

    const changeDisplayed = () => setChanged(false);

    return {
        status : status,
        message : message,
        changed : changed,
        changePopup : changePopup,
        colorAccordingToSucessState : colorAccordingToSucessState,
        changeDisplayed : changeDisplayed
    }

}