var lang = {}
var EN = {}
var RU = {}

EN['and'] = ' and '
RU['and'] = ' и '

// // // 

EN['ping'] = 'Hello!'
RU['ping'] = 'Привет!'

EN['config-main'] = 'Well, this is config.\nThere you can redefine bot prefix, log channel and other useless stuff.'
RU['config-main'] = 'Ну, это конфиг.\nЗдесь можно задать префикс для использования, канал для логов и другие ненужные штуки.'

EN['config-info-title'] = 'Current config for this guild.'
RU['config-info-title'] = 'Текущий конфиг этого сервера.'

EN['config-invalid-field'] = 'There is... no field like that. You can get possible to edit fields if you use command "config" without any arguments.'
RU['config-invalid-field'] = 'Такого... поля в конфиге нет. Возможные поля для редактирования ты можешь получить, использовав команду "config" без аргументов.'

EN['config-editing-error'] = 'Something weird happened during editing config.'
RU['config-editing-error'] = 'Что-то странное произошло во время редактирования конфига.'

EN['config-editing-success'] = 'Config was successfully edited!'
RU['config-editing-success'] = 'Конфиг был успешно отредактирован!'

EN['config-editing-result'] = 'Changed value in config!'
RU['config-editing-result'] = 'Значение в конфиге было изменено!'

EN['roll-result'] = 'A random number between '
RU['roll-result'] = 'Случайное число между '

EN['user-joined-server'] = 'Member have joined server'
RU['user-joined-server'] = 'Участник подключился к северу'

EN['user-joined-member'] = 'Joined member: '
RU['user-joined-member'] = 'Подключившийся человек: '

EN['user-joined-link'] = 'Located link: '
RU['user-joined-link'] = 'Ссылка приглашения: '

EN['user-joined-owner'] = 'Link owner: '
RU['user-joined-owner'] = 'Link owner: '

EN['message-logger-deleted'] = 'Message was deleted.'
RU['message-logger-deleted'] = 'Сообщение было удалено.'

EN['message-logger-edit-wasnt-found'] = 'Message wasn\'t found'
RU['message-logger-edit-wasnt-found'] = 'Сообщение не было найдено'

EN['message-logger-edited'] = 'Message was edited.'
RU['message-logger-edited'] = 'Сообщение было отредактированно.'

EN['message-logger-link'] = 'Link: '
RU['message-logger-link'] = 'Ссылка: '

EN['message-logger-before-edit'] = 'Message before edit:'
RU['message-logger-before-edit'] = 'Сообщение перед редактированием:'

EN['message-logger-after-edit'] = 'Message after edit:'
RU['message-logger-after-edit'] = 'Сообщение после редактирования:'

EN['message-logger-attachments'] = 'Message has following attachments:'
RU['message-logger-attachments'] = 'У сообщения есть такие вложения:'

EN['message-logger-author-unknown'] = 'Author unknown.'
RU['message-logger-author-unknown'] = 'Автор неизвестен.'

EN['message-logger-contents'] = 'Message contents:'
RU['message-logger-contents'] = 'Содержимое сообщения:'

EN['message-logger-contents-unknown'] = 'Contents unknown.'
RU['message-logger-contents-unknown'] = 'Содержимое неизвестно.'

EN['no-permission'] = 'You do not have permission to use this command.'
RU['no-permission'] = 'У тебя нет доступа к этой команде.'

EN['puro'] = "Whoops, guess I ain't this fluffy latex beast you're searchin' for. Try next time with some other bot that will actually give you some stuff."
RU['puro'] = 'Упс, похоже, что я не тот пушистый латексный зверь, которого ты ищешь. В следующий раз попробуй это с каким-нибудь другим ботом, который даст тебе настоящего Пуро.'
//
lang['russia'] = RU
lang['default'] = EN
module.exports.getlang = function(field, guild) {
    if (guild.region in lang && field in lang[guild.region])
        return lang[guild.region][field]
    else
        if (field in lang['default'])
            return lang['default'][field]
        else
            return 'FIELD NOT FOUND PLZ CREATE ISSUE - https://github.com/Kistras/VaccavaJS'
}
