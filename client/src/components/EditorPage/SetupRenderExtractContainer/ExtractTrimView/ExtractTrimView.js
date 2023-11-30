import React, { useState } from 'react';
import VideoUploadField from './VideoUploadField';
import './ExtractTrimView.css';

function ExtractTrimView({ sessionId }) {
    const [videoUploaded, setVideoUploaded] = useState(false);

    // const handleVideoUploadSuccess = () => {
    //     setVideoUploaded(true);
    //     downloadExtractedFrame();
    //     downloadTrimmedVideo();

    //     setTimeout(() => {
    //         setVideoUploaded(false);
    //     }, 1000);
    // };
    const downloadTrimmedVideo = () => {
        fetch("/downloadVideo", {
            method: "GET",
            headers: {
                "X-Session-ID": sessionId
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "trimmedVideo.mp4";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error("Error during video download:", error);
        });
    };
    
    const downloadExtractedFrame = () => {
        fetch("/downloadImage", {
            method: "GET",
            headers: {
                "X-Session-ID": sessionId
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "extractedFrame.jpeg";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error("Error during image download:", error);
        });
    };
    

    return (
        <div className="extract-and-trim-container">
            <h2 className="extract-and-trim-header">Extract (disabled) </h2>
            <div className="drag-and-drop-contaner">
            {!videoUploaded ? (
                <VideoUploadField 
                    fileType=".mp4" 
                    sessionId={sessionId} 
                    // onUploadSuccess={handleVideoUploadSuccess} 
                />
            ) : (
                <p>Video processing...</p>
            )}
            </div>
        </div>
    );
}

export default ExtractTrimView;
