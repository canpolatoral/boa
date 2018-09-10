/**
 * A command handler that may be registered with the
 * {@link CommandStack} via {@link CommandStack#registerHandler}.
 */
export default function CommandHandler() {}


/**
 * Execute changes described in the passed action context.
 *
 * @param {Object} context the execution context
 *
 * @return {Array<djs.model.Base>} list of touched (áka dirty) diagram elements
 */
CommandHandler.prototype.execute = function() {};


/**
 * Revert changes described in the passed action context.
 *
 * @param {Object} context the execution context
 *
 * @return {Array<djs.model.Base>} list of touched (áka dirty) diagram elements
 */
CommandHandler.prototype.revert = function() {};


/**
 * Return true if the handler may execute in the given context.
 *
 * @abstract
 *
 * @param {Object} context the execution context
 *
 * @return {Boolean} true if executing in the context is possible
 */
CommandHandler.prototype.canExecute = function() {
  return true;
};


/**
 * Execute actions after the actual command execution but
 * grouped together (for undo/redo) with the action.
 *
 * @param {Object} context the execution context
 */
CommandHandler.prototype.preExecute = function() {};

/**
 * Execute actions after the actual command execution but
 * grouped together (for undo/redo) with the action.
 *
 * @param {Object} context the execution context
 */
CommandHandler.prototype.postExecute = function() {};