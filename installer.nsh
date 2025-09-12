; Custom NSIS installer script for TCF Simulator Pro

; Show license agreement
!define MUI_LICENSEPAGE_TEXT_TOP "Veuillez lire attentivement les termes de la licence avant d'installer TCF Simulator Pro."
!define MUI_LICENSEPAGE_TEXT_BOTTOM "Vous devez accepter les termes de cette licence pour continuer l'installation."

; Custom finish page
!define MUI_FINISHPAGE_TITLE "Installation terminée avec succès"
!define MUI_FINISHPAGE_TEXT "TCF Simulator Pro a été installé avec succès sur votre ordinateur.$\r$\n$\r$\nCliquez sur Terminer pour fermer cet assistant d'installation."
!define MUI_FINISHPAGE_RUN "$INSTDIR\TCF Simulator Pro.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Lancer TCF Simulator Pro maintenant"

; Custom messages
LangString DESC_Section1 ${LANG_FRENCH} "Fichiers principaux de l'application"
LangString DESC_Section2 ${LANG_FRENCH} "Raccourcis du menu Démarrer"
LangString DESC_Section3 ${LANG_FRENCH} "Raccourci sur le Bureau"

; Installation complete message
Function .onInstSuccess
  MessageBox MB_OK "TCF Simulator Pro a été installé avec succès!$\r$\n$\r$\nVous pouvez maintenant lancer l'application depuis le menu Démarrer ou le raccourci du Bureau."
FunctionEnd