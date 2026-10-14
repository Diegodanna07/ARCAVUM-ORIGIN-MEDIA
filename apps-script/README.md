# ARCAVUM ∅RIGIN — Sincronizzazione Drive → GitHub MEDIA

**STATO: codice in revisione; non attivato.** Zero pubblicazioni Instagram e zero trasferimenti automatici finché il proprietario non completa la configurazione.

## Perché

Le immagini devono viaggiare direttamente da Google Drive a GitHub, senza passare dal contesto testuale ChatGPT. La pubblicazione Instagram tramite Metricool resta un'operazione separata e richiede autorizzazione.

## Protezioni

- Lo script legge SOLO la cartella privata di **uscita** `07_CODA_GITHUB_DA_PUBBLICARE`, distinta dall'archivio ufficiale `06_CONTENUTI_APPROVATI`.
- In coda si inseriscono **copie** dei soli file che il proprietario ha esplicitamente autorizzato a rendere pubblici.
- Solo `image/png` e `image/jpeg`, massimo 10 MiB; massimo due trasferimenti per esecuzione.
- Niente modifiche o cancellazioni dei file Drive, né modifica dei permessi Drive.
- GitHub non sovrascrive file con percorso già esistente. I file GitHub saranno **pubblici**.
- Nessun token nel codice o in GitHub: il token resta nelle **Proprietà script** del progetto Apps Script privato del proprietario.
- Il trigger viene creato solo dopo l'esecuzione manuale della funzione `arcavumInstallTrigger`.
- Il PC può restare spento: l'operazione avviene tra Google Apps Script e GitHub.

## Configurazione iniziale (una volta sola, effettuata dal proprietario)

1. Aprire https://script.google.com/ e creare un nuovo progetto **privato** `ARCAVUM_MEDIA_SYNC`.
2. Copiare il contenuto di `Code.gs` nell'editor e salvare.
3. In GitHub, creare un **fine-grained personal access token** valido solo per la repository `Diegodanna07/ARCAVUM-ORIGIN-MEDIA`, autorizzando **Contents: Read and write**. Non abilitare altri repository o permessi; scegliere una scadenza e conservarne la data.
4. In Apps Script, aprire **Impostazioni progetto → Proprietà script** e aggiungere:
   - `ARCAVUM_QUEUE_FOLDER_ID` = l'ID della cartella privata `07_CODA_GITHUB_DA_PUBBLICARE` (comunicato in chat dopo la creazione).
   - `ARCAVUM_GITHUB_TOKEN` = il token GitHub appena creato.
5. Eseguire `arcavumPreviewQueue` e autorizzare gli accessi Google richiesti; verificare che la cartella sia vuota.
6. Eseguire `arcavumInstallTrigger` per attivare un controllo ogni 15 minuti.
7. Solo per un test autorizzato, creare su Drive una **copia** di un'immagine approvata e inserirla nella cartella di uscita. Lo script tenterà l'upload alla prossima esecuzione.
8. Verificare su GitHub che il file compaia in `assets/instagram/`, poi predisporre una **bozza Metricool**, mai una pubblicazione non autorizzata.

**Non condividere il token con ChatGPT**, non archiviarlo in Drive, nella chat, né in un commit GitHub.

## Utilizzo successivo

Quando il proprietario autorizzerà uno specifico contenuto, l'assistente potrà copiarlo attraverso il collegamento Drive nella cartella di uscita: il trigger Google trasferirà autonomamente i byte alla repository. L'assistente verificherà la presenza del file e potrà poi utilizzarne l'URL pubblico tramite Metricool.

## Limiti e manutenzione

La coda deve contenere solo asset realmente destinati al pubblico. I nomi file devono essere univoci. Un file già esistente su GitHub non viene sovrascritto. Monitorare le **Esecuzioni** in Apps Script per eventuali errori, scadenze del token o limiti di quota Google. Un trasferimento effettuato non equivale a una pubblicazione Instagram.

Fonti: Google Apps Script quotas https://developers.google.com/apps-script/guides/services/quotas
GitHub Contents API https://docs.github.com/en/rest/repos/contents
