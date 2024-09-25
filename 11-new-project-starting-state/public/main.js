// htmx.config.defaultSwapStyle = 'outerHTML';
htmx.defineExtension('debug', {
    onEvent: function (name, evt) {
        if (console.debug) {
            console.debug(name, evt)
        } else if (console) {
            console.log('DEBUG:', name, evt)
        } else {
            throw new Error('NO CONSOLE SUPPORTED')
        }
    }
});

function showConfirmationModal(event) {
    if (event.detail.path === '/suggested-locations') {
        return;
    }

    event.preventDefault();

    const confirmationModal = `
      <dialog class="modal">
        <div id="confirmation">
          <h2>Are you sure?</h2>
          <p>Do you really want to ${event.detail.elt.dataset.action} this place?</p>
          <div id="confirmation-actions">
            <button id="action-no" className="button-text">
              No
            </button>
            <button id="action-yes" className="button">
              Yes
            </button>
          </div>
        </div>
      </dialog>
    `;
    document.body.insertAdjacentHTML('beforeend', confirmationModal);
    const dialog = document.querySelector('dialog');

    // Close on NO
    document.getElementById('action-no')
        .addEventListener('click', () => {
            dialog.remove();
        });

    // Continue on YES
    document.getElementById('action-yes')
        .addEventListener('click', () => {
            event.detail.issueRequest();
            dialog.remove();
        });

    dialog.showModal();
}

document.addEventListener('htmx:confirm', showConfirmationModal);
