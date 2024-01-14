$(document).ready(function() {
    // Dáta MS Azure
    const clientId = '974175d5-32b4-4a19-a6dc-286d8baf7df2';
    const clientSecret = 'mKC8Q~g2P9an9h8ogNgDBSeE-QpLsDfF1hF8Zcl5';
    const redirectUri = 'https://magr04.github.io/semestralna-praca-aplikace1/';

    // OAuth2
    const authEndpoint = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

    const data = {
        client_id: clientId,
        scope: 'https://graph.microsoft.com/.default',
        client_secret: clientSecret,
        grant_type: 'client_credentials'
    };

    // Získanie prístupového tokenu
    $.ajax({
        url: authEndpoint,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data,
        success: function(response) {
            const accessToken = response.access_token;

            // Fetch udalosti
            fetchCalendarEvents(accessToken);
        },
        error: function(error) {
            console.error('Chyba pri autentifikácii:', error);
        }
    });

    // Fetch udalosti
    function fetchCalendarEvents(accessToken) {
        const apiUrl = 'https://graph.microsoft.com/v1.0/me/events';

        $.ajax({
            url: apiUrl,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            success: function(response) {
                // Zobrazí udalosti
                const events = response.value;
                const eventsList = $('#events-list');
                
                events.forEach(function(event) {
                    const startDate = new Date(event.start.dateTime);
                    const listItem = $('<li></li>');
                    listItem.html(`
                        <strong>${event.subject}</strong> 
                        ${startDate}
                        <textarea class="event-notes" placeholder="Zadejte poznámku pre túto udalosť..."></textarea>
                        <select class="event-category">
                        <option value="Vseobecne">Všeobecné</option>
                        <option value="Revizia">Revízia</option>
                        <option value="Planovanie">Plánovanie</option>
                        <option value="Diskusia">Diskusia</option>
                        </select>
                        <label>
                            <input type="checkbox" class="event-completed" /> Hotové
                        </label>
                    `);
                    eventsList.append(listItem);
                    addSaveButtonToListItem(listItem);
                });

                
            },
            error: function(error) {
                console.error('Chyba pri načítaní', error);
            }
        });

    }

    // Pridanie tlačidla uložiť
    function addSaveButtonToListItem(listItem) {
        const saveButton = $('<button class="save-btn">Uložiť</button>');
        saveButton.click(function() {
            const notes = listItem.find('.event-notes').val();
            const category = listItem.find('.event-category').val();
            const completed = listItem.find('.event-completed').is(':checked');
            console.log('Uložené: Poznámka:', notes, 'Kategória:', category);
            alert('Uložené: Poznámka: ' + notes + ' Kategória: ' + category  + ' Hotové: ' + completed + ' ');
        });

        listItem.append(saveButton);
    }

    //TESTOVANIE UDALOSTI (bez Azure)
    
    const testEvents = [
        { subject: 'Scrum Meeting', start: { dateTime: '2024-01-02T06:00:00' } },
        { subject: 'Revízia designu', start: { dateTime: '2024-01-02T07:00:00' } },
        { subject: 'Výtváranie roadmapy', start: { dateTime: '2024-01-02T08:00:00' } },
        { subject: 'Retrospektívny meeting', start: { dateTime: '2024-01-03T09:00:00' }}
    ];

    const eventsList = $('#events-list');

    testEvents.forEach(function(event) {
        const startDate = new Date(event.start.dateTime);
        const listItem = $('<li></li>');
        listItem.html(`
            <strong>${event.subject}</strong> 
            ${startDate}
            <textarea class="event-notes" placeholder="Zadejte poznámku pre túto udalosť..."></textarea>
            <select class="event-category">
                <option value="Vseobecne">Všeobecné</option>
                <option value="Revizia">Revízia</option>
                <option value="Planovanie">Plánovanie</option>
                <option value="Diskusia">Diskusia</option>
            </select>
            <label>
                <input type="checkbox" class="event-completed" /> Hotové
            </label>
        `);

        eventsList.append(listItem);
        addSaveButtonToListItem(listItem);

    });
    
});
