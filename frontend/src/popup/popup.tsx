import { useEffect, useState } from "react";
import "./popup.scss";
import usePopupService from "../services/popup.service";

export default function Popup() {
    const popupService = usePopupService();

    const [status, setStatus] = useState(popupService.status);
    const [message, setMessage] = useState(popupService.message);
    const [opacity, setOpacity] = useState(0);
    const [showIt, setShowIt] = useState(false);

    useEffect(() => {
        if (popupService.changed) {
            setStatus(popupService.status);
            setMessage(popupService.message);
            setShowIt(true);
            setOpacity(1);
            setTimeout(function () {
                setOpacity(0);
            }, 2000);
            popupService.changeDisplayed();
        }
    }, [popupService]);

    return showIt ? (
        <p
            id="popup"
            style={{ backgroundColor: popupService.colorAccordingToSucessState(status), opacity: opacity }}
            onClick={() => setShowIt(false)}
        >
            {message}
        </p>
    ) : (
        <></>
    );
}
