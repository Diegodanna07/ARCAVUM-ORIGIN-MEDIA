# ARCAVUM ∅RIGIN — Trasferimento Drive → GitHub MEDIA

**Stato operativo al 15 ottobre 2026:** installato e collaudato su un progetto Google Apps Script PRIVATO denominato `ARCAVUM_MEDIA_SYNC`. Il trasferimento manuale è riuscito, e sono state confermate cinque esecuzioni periodiche consecutive senza errori di esecuzione. Le esecuzioni a coda vuota non costituiscono trasferimenti di file.

Questo repository contiene una **copia di riferimento** del codice `Code.gs`. Il progetto Apps Script attivo NON si aggiorna automaticamente quando si modifica GitHub: ogni modifica va verificata, riportata manualmente su Apps Script e riesaminata prima di salvare.

## Architettura

1. **Archivio originale su Drive**: `06_CONTENUTI_APPROVATI`. Non toccare o spostare i master.
2. **Coda privata su Drive**: `07_CODA_GITHUB_DA_PUBBLICARE`. Inserire COPIE di file soltanto dopo esplicita approvazione alla diffusione pubblica dell'immagine.
3. **Google Apps Script** legge la coda con `arcavumSyncApprovedMedia` ogni ~15 minuti e invia i byte all'API GitHub. La trasformazione Base64 resta nell'ambiente Google e NON transita nella chat.
4. **GitHub pubblico**: `Diegodanna07/ARCAVUM-ORIGIN-MEDIA`, percorso `assets/instagram/`; i file trasferiti diventano accessibili pubblicamente.
5. **Metricool** legge URL pubblici da GitHub e può programmare i post approvati sull'account Instagram `@arcavum_origin`. **Importazione su GitHub ≠ autorizzazione alla pubblicazione Instagram.**

## Restrizioni dello script

- Solo file PNG e JPEG, massimo 10 MiB ciascuno; massimo due nuovi file per esecuzione.
- Nessuna sovrascrittura se il percorso GitHub è già occupato; usare nomi univoci.
- Nessuna modifica, condivisione o cancellazione di file su Drive da parte dello script.
- Una proprietà privata `ARCAVUM_UPLOADED_<file-id>` evita il caricamento ripetuto di un file già trasferito.
- Lo script NON sposta automaticamente i file elaborati fuori dalla coda. L'archiviazione delle copie di prova è stata svolta separatamente.
- Il trigger si configura tramite `arcavumInstallTrigger`, che sostituisce eventuali altri trigger associati alla stessa funzione per evitare duplicazioni.
- La pubblicazione su Instagram non è gestita da questo script.

## Credenziali e manutenzione

- Il proprietario deve conservare il **fine-grained PAT** esclusivamente nelle **Proprietà script** private: `ARCAVUM_GITHUB_TOKEN`; permessi GitHub: solo la repository MEDIA, `Contents: Read and write`.
- L'ID della cartella di coda è in `ARCAVUM_QUEUE_FOLDER_ID`, anch'esso impostato privatamente.
- **Non inserire il token** in GitHub, in Drive, in screenshot, nella chat o nel codice.
- Monitorare **Apps Script → Esecuzioni** dopo le nuove pubblicazioni e in caso di errori.
- Controllare la scadenza del token e rinnovarlo per tempo. In caso di errore 401/403 di GitHub, verificare credenziali e permessi senza condividere il token.
- Il repository è **pubblico**: evitare concept non annunciati, spoiler, dati riservati e file non esplicitamente approvati per la distribuzione.
- L'archivio privato `08_ARCHIVIO_TEST_AUTOMAZIONE` conserva una copia di prova fuori dalla coda.

## Collaudi confermati

- Drive: anteprima cartella vuota riuscita.
- GitHub: autenticazione personale riuscita.
- Trasferimento: copia privata di `Ten Lives` sincronizzata senza Base64 nella chat; dimensione e SHA della copia trasferita corrispondevano all'originale già pubblico.
- Trigger: cinque esecuzioni automatiche consecutive completate il 15 ottobre 2026.
- Instagram: un post reale tramite Metricool è stato pubblicato e verificato dall'utente, poi eliminato dall'utente stesso.

**Pulizia collaudi:** la copia privata di prova è stata archiviata fuori dalla coda; i file di test non necessari sono stati rimossi dal ramo `main` di GitHub. Il PNG originale approvato resta pubblico.

## Procedura operativa per i futuri post

1. Preparare il contenuto e ottenere la **specifica approvazione** per renderne pubblica la copia.
2. Inserire una copia nella coda Drive.
3. Attendere il trigger, controllare il log e verificare il file su GitHub.
4. Creare la bozza Metricool, controllarne anteprima e didascalia.
5. Pubblicare/programmare soltanto dietro autorizzazione; verificare l'esito in Instagram.

Riferimenti tecnici: https://developers.google.com/apps-script/guides/services/quotas
GitHub Contents API: https://docs.github.com/en/rest/repos/contents
