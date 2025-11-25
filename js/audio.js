/**
 * Audio Module
 * Handles audio player and subtitle synchronization
 */

const AudioPlayer = {
    player: null,
    subtitleDisplay: null,
    track: null,
    manualCues: [], // Store manually parsed cues

    /**
     * Initialize audio player functionality
     */
    init() {
        this.player = document.getElementById('audioPlayer');
        this.subtitleDisplay = document.getElementById('subtitleText');

        if (!this.player || !this.subtitleDisplay) {
            return;
        }

        this.setupSubtitles();
        this.setupEventListeners();
        this.loadVTTManually(); // Load VTT file manually as fallback
    },

    /**
     * Set up subtitle synchronization
     */
    setupSubtitles() {
        // Get the track element from the HTML
        const trackElement = this.player.querySelector('track');

        if (!trackElement) {
            console.error('No track element found in audio player');
            return;
        }

        // Wait for the track to load
        trackElement.addEventListener('load', () => {
            console.log('Track loaded successfully');

            if (this.player.textTracks.length > 0) {
                this.track = this.player.textTracks[0];
                this.track.mode = 'hidden'; // Use hidden to prevent browser's native display

                console.log('Track object:', this.track);
                console.log('Track readyState:', this.track.readyState);
                console.log('Track cues available:', this.track.cues ? this.track.cues.length : 'null');

                // Listen for cue changes
                this.track.addEventListener('cuechange', () => {
                    console.log('Cue changed!');
                    this.updateSubtitle();
                });
            }
        });

        trackElement.addEventListener('error', (e) => {
            console.error('Track failed to load:', e);
            this.subtitleDisplay.textContent = 'Failed to load subtitles. Please check the VTT file.';
        });

        // Force track to load by setting mode
        setTimeout(() => {
            if (this.player.textTracks.length > 0) {
                this.track = this.player.textTracks[0];
                this.track.mode = 'hidden';
                console.log('Track initialized on timeout');
            }
        }, 100);

        // Also listen to timeupdate as a fallback for subtitle updates
        this.player.addEventListener('timeupdate', () => {
            if (this.track && this.track.cues && this.track.cues.length > 0) {
                this.updateSubtitleByTime();
            } else if (this.track) {
                // Track exists but cues not loaded yet
                console.log('Waiting for cues to load...');
            }
        });
    },

    /**
     * Set up event listeners for audio player
     */
    setupEventListeners() {
        // Update subtitle when audio ends
        this.player.addEventListener('ended', () => {
            this.subtitleDisplay.textContent = 'Audio finished. Click play to listen again.';
            this.subtitleDisplay.classList.remove('active');
        });

        // Show ready message when paused at start
        this.player.addEventListener('pause', () => {
            if (this.player.currentTime === 0) {
                this.subtitleDisplay.textContent = 'Press play to start the audio guide...';
                this.subtitleDisplay.classList.remove('active');
            }
        });

        // Show initial message when playing starts
        this.player.addEventListener('play', () => {
            if (this.player.currentTime < 1 && !this.track.activeCues.length) {
                this.subtitleDisplay.textContent = 'Loading subtitles...';
            }
        });
    },

    /**
     * Update subtitle display with current cue
     */
    updateSubtitle() {
        if (!this.track || !this.subtitleDisplay) {
            console.warn('Track or subtitle display not available');
            return;
        }

        const activeCues = this.track.activeCues;

        if (activeCues && activeCues.length > 0) {
            // Display the current subtitle
            const cueText = activeCues[0].text;
            this.subtitleDisplay.textContent = cueText;
            this.subtitleDisplay.classList.add('active');
            console.log('Displaying subtitle:', cueText);
        } else {
            // No active cue
            if (this.player && this.player.currentTime > 0 && !this.player.paused) {
                this.subtitleDisplay.textContent = '...';
                this.subtitleDisplay.classList.remove('active');
            }
        }
    },

    /**
     * Update subtitle by manually checking current time against cues
     * This is a fallback method when cuechange events don't fire
     */
    updateSubtitleByTime() {
        const currentTime = this.player.currentTime;
        let currentCue = null;

        // Try native track cues first
        if (this.track && this.track.cues && this.track.cues.length > 0) {
            for (let i = 0; i < this.track.cues.length; i++) {
                const cue = this.track.cues[i];
                if (currentTime >= cue.startTime && currentTime <= cue.endTime) {
                    currentCue = cue;
                    break;
                }
            }
        }
        // Fallback to manually loaded cues
        else if (this.manualCues.length > 0) {
            for (let i = 0; i < this.manualCues.length; i++) {
                const cue = this.manualCues[i];
                if (currentTime >= cue.startTime && currentTime <= cue.endTime) {
                    currentCue = cue;
                    break;
                }
            }
        }

        if (currentCue) {
            // Display the current subtitle
            this.subtitleDisplay.textContent = currentCue.text;
            this.subtitleDisplay.classList.add('active');
        } else {
            // No active cue
            if (this.player.currentTime > 0 && !this.player.paused) {
                this.subtitleDisplay.textContent = '...';
                this.subtitleDisplay.classList.remove('active');
            }
        }
    },

    /**
     * Manually load and parse VTT file as a fallback
     */
    loadVTTManually() {
        fetch('assets/audio/Transcript.vtt')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(vttText => {
                console.log('VTT file loaded manually via fetch');
                this.parseVTT(vttText);
            })
            .catch(error => {
                console.error('Failed to load VTT file via fetch:', error);
                console.log('Fetch blocked - trying XMLHttpRequest fallback');
                this.loadVTTWithXHR();
            });
    },

    /**
     * Load VTT using XMLHttpRequest as fallback for strict browsers
     */
    loadVTTWithXHR() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'assets/audio/Transcript.vtt', true);

        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 0) { // 0 for local files
                console.log('VTT file loaded via XHR');
                this.parseVTT(xhr.responseText);
            } else {
                console.error('XHR failed with status:', xhr.status);
                this.subtitleDisplay.textContent = 'Unable to load subtitles. Please use a local server or try Safari.';
            }
        };

        xhr.onerror = () => {
            console.error('XHR request failed');
            this.subtitleDisplay.textContent = 'Subtitles unavailable in this browser. Try Safari or use a local server.';
        };

        xhr.send();
    },

    /**
     * Parse VTT text into cue objects
     */
    parseVTT(vttText) {
        const lines = vttText.split('\n');
        let i = 0;

        // Skip WEBVTT header
        while (i < lines.length && !lines[i].includes('-->')) {
            i++;
        }

        // Parse cues
        while (i < lines.length) {
            const line = lines[i].trim();

            // Check if this is a timestamp line
            if (line.includes('-->')) {
                const times = line.split('-->');
                const startTime = this.parseTimestamp(times[0].trim());
                const endTime = this.parseTimestamp(times[1].trim());

                // Get the text (next non-empty lines until blank line)
                i++;
                let text = '';
                while (i < lines.length && lines[i].trim() !== '') {
                    if (text) text += ' ';
                    text += lines[i].trim();
                    i++;
                }

                this.manualCues.push({
                    startTime: startTime,
                    endTime: endTime,
                    text: text
                });
            }
            i++;
        }

        console.log(`Parsed ${this.manualCues.length} cues from VTT file`);
    },

    /**
     * Parse VTT timestamp (HH:MM:SS.mmm) to seconds
     */
    parseTimestamp(timestamp) {
        const parts = timestamp.split(':');
        const seconds = parts[parts.length - 1].split('.');

        let totalSeconds = 0;

        if (parts.length === 3) {
            // HH:MM:SS.mmm
            totalSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(seconds[0]);
        } else if (parts.length === 2) {
            // MM:SS.mmm
            totalSeconds = parseInt(parts[0]) * 60 + parseFloat(seconds[0]);
        } else {
            // SS.mmm
            totalSeconds = parseFloat(seconds[0]);
        }

        if (seconds.length > 1) {
            totalSeconds += parseFloat('0.' + seconds[1]);
        }

        return totalSeconds;
    }
};
