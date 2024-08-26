import { storeAudioForNextOpening } from "./helper";

// Play Audio
export const play = async (playbackObj, uri) => {
    try {
        return await playbackObj.loadAsync(
            { uri }, //! => { uri: uri }
            { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
        );
    } catch (err) {
        console.log(`Error Inside Play Audio Method`, err);
    }
};

// Pause Audio
export const pause = async (playbackObj) => {
    try {
        return await playbackObj.setStatusAsync({
            shouldPlay: false,
        });
    } catch (err) {
        console.log(`Error Inside Pause Audio Method`, err);
    }
};

// resume Audio
export const resume = async (playbackObj) => {
    try {
        return await playbackObj.playAsync();
    } catch (err) {
        console.log(`Error Inside Resume Audio Method`, err);
    }
};

// Select Another Audio
export const anotherAudio = async (playbackObj, uri) => {
    try {
        await playbackObj.stopAsync();
        await playbackObj.unloadAsync();
        return await play(playbackObj, uri);
    } catch (err) {
        console.log(`Error Inside Select another Audio Method`, err);
    }
};

export const selectAudio = async (audio, context) => {
    const {
        soundObj,
        playbackObj,
        currentAudio,
        updateState,
        audioFiles,
        onPlaybackStatusUpdate,
    } = context;

    try {
        // Playing Audio For The First Time
        if (soundObj === null) {
            const status = await play(playbackObj, audio.uri);
            const index = audioFiles.indexOf(audio);

            updateState(context, {
                currentAudio: audio,
                soundObj: status,
                isPlaying: true,
                currentAudioIndex: index,
            });
            playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

            return storeAudioForNextOpening(audio, index);
        }

        // Pause Audio
        if (
            soundObj.isLoaded &&
            soundObj.isPlaying &&
            currentAudio.id === audio.id
        ) {
            const status = await pause(playbackObj);

            return updateState(context, {
                soundObj: status,
                isPlaying: false,
            });
        }

        // Resume Audio
        if (
            soundObj.isLoaded &&
            !soundObj.isPlaying &&
            currentAudio.id === audio.id
        ) {
            const status = await resume(playbackObj);

            return updateState(context, {
                soundObj: status,
                isPlaying: true,
            });
        }

        // Select Another Audio
        await playbackObj.stopAsync();
        await playbackObj.unloadAsync();

        const status = await play(playbackObj, audio.uri);
        const index = audioFiles.indexOf(audio);

        updateState(context, {
            currentAudio: audio,
            playbackObj: playbackObj,
            soundObj: status,
            isPlaying: true,
            currentAudioIndex: index,
        });
        return storeAudioForNextOpening(audio, index);
    } catch (err) {
        console.log(`Error Inside Select Audio Method`, err.message);
    }
};

export const changeAudio = async (context, select) => {
    const {
        playbackObj,
        updateState,
        audioFiles,
        currentAudioIndex,
        totalAudioCount,
    } = context;
    try {
        let status, audio, index;
        const { isLoaded } = await playbackObj.getStatusAsync();

        // For Next Audio
        if (select === "next") {
            index = currentAudioIndex + 1;

            index = index >= totalAudioCount ? totalAudioCount - 1 : index;

            audio = audioFiles[index];

            if (isLoaded) {
                await playbackObj.stopAsync();
                await playbackObj.unloadAsync();
            }

            status = await play(playbackObj, audio.uri);
        } else if (select === "prev") {
            // For Previous Audio

            index = currentAudioIndex - 1;

            index = index <= -1 ? 0 : index;

            audio = audioFiles[index];

            if (isLoaded) {
                await playbackObj.stopAsync();
                await playbackObj.unloadAsync();
            }

            status = await play(playbackObj, audio.uri);
        }

        updateState(context, {
            playbackObj: playbackObj,
            currentAudio: audio,
            soundObj: status,
            isPlaying: true,
            currentAudioIndex: index,
            playbackPosition: null,
            playbackDuration: null,
        });

        storeAudioForNextOpening(audio, index);
    } catch (err) {
        console.log(`Error Inside Change Audio Method`, err.message);
    }
};
