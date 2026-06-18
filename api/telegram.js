const clean=value=>String(value||'').trim().slice(0,3000);

module.exports=async function handler(request,response){
	if(request.method!=='POST')return response.status(405).json({error:'Method not allowed'});
	const {TELEGRAM_BOT_TOKEN,TELEGRAM_CHAT_ID}=process.env;
	if(!TELEGRAM_BOT_TOKEN||!TELEGRAM_CHAT_ID)return response.status(503).json({error:'Telegram is not configured'});
	const {name,email,phone,country,message,language,source}=request.body||{};
	if(!clean(name)||!clean(email)||!clean(message))return response.status(400).json({error:'Missing required fields'});
	const text=['✨ Nowe zapytanie — LEDFlex','',`👤 ${clean(name)}`,`✉️ ${clean(email)}`,phone?`📞 ${clean(phone)}`:null,`📍 ${clean(country)}`,`🌐 ${clean(language).toUpperCase()}`,'',`💬 ${clean(message)}`,'',source?`Źródło: ${clean(source)}`:null].filter(Boolean).join('\n');
	try{const telegramResponse=await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:TELEGRAM_CHAT_ID,text,disable_web_page_preview:true})});if(!telegramResponse.ok)throw new Error('Telegram API error');return response.status(200).json({ok:true})}catch(error){return response.status(502).json({error:'Could not deliver message'})}
}
