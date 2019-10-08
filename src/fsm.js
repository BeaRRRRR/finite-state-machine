class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) throw new Error();
        this.config = config;
        this.undoCount = 0;
        this.state = 'normal';
        this.states = ['normal'];
        this.undoes = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (state != 'normal' && state != 'busy' && state != 'sleeping' && state != 'hungry') throw new Error();
        this.state = state;
        this.states.push(state);
        this.undoes = [];
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (event == 'study' && this.state == 'normal') {
            this.state = 'busy';
        } else if (event == 'study' && this.state != 'normal') {
            throw new Error;
        } else if (event == 'get_hungry' && (this.state == 'busy' || this.state == 'sleeping')) {
            this.state = 'hungry';
        } else if (event == 'get_hungry' && this.state != 'busy') {
            throw new Error;
        } else if (event == 'get_tired' && this.state == 'busy') {
            this.state = 'sleeping';
        } else if (event == 'get_tired' && this.state != 'busy') {
            throw new Error;
        } else if (event == 'get_up' && this.state == 'sleeping') {
            this.state = "normal";
        } else if (event == 'get_up' && this.state != 'sleeping') {
            throw new Error;
        } else if (event == 'eat' && this.state == 'hungry') {
            this.state = "normal";
        } else if (event == 'eat' && this.state != 'hungry') {
            throw new Error;
        } else {
            throw new Error;
        }
        this.states.push(this.state);
        this.undoes = [];
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = 'normal'
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let list = [];
        if (!event) return Object.keys(this.config.states);
        else {
            Object.keys(this.config.states).forEach(key => {
                if (Object.keys(this.config.states[key].transitions).includes(event)) list.push(key);
                // Object.values(this.config.states[key].transitions).forEach(value => push{
                // if (value == event) list.push(value);
                // })
            });
            return list;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.states.length <= 1) return false;
        let poppedState = this.states.pop();
        this.state = this.states[this.states.length - 1];
        this.undoes.push(poppedState);
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.undoes.length === 0) return false;
        this.state = this.undoes.pop();
        this.states.push(this.state);
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.states = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
