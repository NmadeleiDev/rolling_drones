from tensorflow import keras
import pandas as pd
import numpy as np
from Levenshtein import distance
import tensorflow as tf
from tensorflow.keras.layers import Dense, Flatten, Input, Lambda
import re


def find_data(frame, features):
        rows = list(frame[frame.columns[0]])
        col = []
        for f in features:
            dist = []
            for r in rows:
                dist.append(distance(str(f), str(r))) 
            if rows:
                t = np.argmin(np.asarray(dist))
                if min(np.asarray(dist)) > 10:
                    raise Exception("Not enought data")
                col.append(rows[t])
                rows.remove(rows[t])
        return frame.loc[[i in col for i in frame[frame.columns[0]]]].drop_duplicates(subset = [frame.columns[0]]).sort_values(frame.columns[0])
    
features2_outlay = sorted(['Расходы бюджета - ИТОГО', 'ОБЩЕГОСУДАРСТВЕННЫЕ ВОПРОСЫ', 'НАЦИОНАЛЬНАЯ ОБОРОНА', 'ОБРАЗОВАНИЕ', 'КУЛЬТУРА, КИНЕМАТОГРАФИЯ', 'СОЦИАЛЬНАЯ ПОЛИТИКА', 'ФИЗИЧЕСКАЯ КУЛЬТУРА И СПОРТ', 'ОБСЛУЖИВАНИЕ ГОСУДАРСТВЕННОГО И МУНИЦИПАЛЬНОГО ДОЛГА'])
features2 = sorted(['НАЛОГОВЫЕ И НЕНАЛОГОВЫЕ ДОХОДЫ', 'НАЛОГИ НА ПРИБЫЛЬ, ДОХОДЫ', 'НАЛОГИ НА ТОВАРЫ (РАБОТЫ, УСЛУГИ), РЕАЛИЗУЕМЫЕ НА ТЕРРИТОРИИ РОССИЙСКОЙ ФЕДЕРАЦИИ', 'НАЛОГИ НА СОВОКУПНЫЙ ДОХОД', 'НАЛОГИ НА ИМУЩЕСТВО', 'НАЛОГИ, СБОРЫ И РЕГУЛЯРНЫЕ ПЛАТЕЖИ ЗА ПОЛЬЗОВАНИЕ ПРИРОДНЫМИ РЕСУРСАМИ', 'ДОХОДЫ ОТ ИСПОЛЬЗОВАНИЯ ИМУЩЕСТВА, НАХОДЯЩЕГОСЯ В ГОСУДАРСТВЕННОЙ И МУНИЦИПАЛЬНОЙ СОБСТВЕННОСТИ', 'ПЛАТЕЖИ ПРИ ПОЛЬЗОВАНИИ ПРИРОДНЫМИ РЕСУРСАМИ', 'ДОХОДЫ ОТ ПРОДАЖИ МАТЕРИАЛЬНЫХ И НЕМАТЕРИАЛЬНЫХ АКТИВОВ'])
features1 = sorted(['Численность постоянного населения (среднегодовая)', 'декабрь к декабрю', 'в среднем за год', 'в основных ценах соответствующих лет', 'Индекс промышленного производства (С+D+E)', 'по разделу C: Добыча полезных ископаемых', 'по разделу D: Обрабатывающие производства', 'производство пищевых продуктов, включая напитки, и табака', 'обработка древесины и производство изделий из дерева', 'целлюлозно-бумажное производство; издательская и полиграфическая деятельность', 'металлургическое производство и производство готовых металлических изделий', 'производство машин и оборудования', 'производство электрооборудования, электронного и оптического оборудования', 'производство транспортных средств и оборудования', 'по разделу Е: Производство и распределение электроэнергии, газа и воды', 'железорудные окатыши', 'щебень и гравий', 'древесина необработанная', 'лесоматериалы продольно распиленные', 'древесностружечные плиты, плиты OSB', 'бумага', 'целлюлоза древесная и целлюлоза из прочих волокнистых материалов (сульфатная, сульфитная)', 'мешки бумажные', 'Реализация алкогольной продукции организациями-производителями', 'Картофель', 'Овощи', 'Скот и птица (в живом весе)', 'Молоко', 'Яйца', 'Инвестиции в основной капитал за счет всех источников финансирования', 'Ввод в эксплуатацию жилых домов за счет всех источников финансирования', 'Оборот розничной торговли', 'Объем платных услуг населению', 'Фонд заработной платы', 'Фонд заработной платы с учетом необлагаемой его части (для расчета налога на доходы физических лиц)', 'Прибыль прибыльных организаций', 'Налогооблагаемая прибыль', 'Среднегодовая остаточная стоимость облагаемого имущества - всего (база для исчисления налога на имущество организаций, поступающего в бюджет РК)', 'Внешнеторговый оборот', 'Экспорт – всего', 'Импорт – всего', 'Численность безработных, зарегистрированных в службах занятости (среднегодовая)', 'Уровень зарегистрированной безработицы (к численности экономически активного населения) (среднегодовая)'])

input_ = Input((len(features1) * 6 + len(features2),))
d = Dense(len(features2))(input_)
income = keras.Model(input_, d, name='income')
income.compile(optimizer='adam', loss='MAE')

outlay = keras.Model(input_, d, name='outlay')
outlay.compile(optimizer='adam', loss='MAE')

def train_outlay(data1, data2, file_outlay):  #Исключительно под обучение на расходы!
                                              #file_outlay должен быть в таком формате: 'my_model_weights.h5'
    
    for i in range(len(data1)):
        data1[i] = data1[i].dropna(subset=[data1[i].columns[0], data1[i].columns[-1]])
        data2[i] = data2[i].dropna(subset=[data2[i].columns[0], data2[i].columns[-1]])
        data1[i] = data1[i].fillna(0)
        data2[i] = data2[i].fillna(0)
    
    train_data = []
    for h in data1[1:]:
        train_data.append(np.asarray(find_data(h, features1)[h.columns[1:]]).reshape(len(features1) * 6,))
    
    train_data_ = []
    for g in data2:
        train_data_.append(np.asarray(find_data(g, features2_outlay)[g.columns[-1]]))
    
    
    target = np.asarray(train_data_[1:]).astype('float32') - np.asarray(train_data_[:len(data2) - 1]).astype('float32')
    train_ = np.concatenate([train_data, train_data_[:len(data2) - 1]], axis = -1)
    train = []
    for i in train_: 
        train___ = []
        for j in i:
            temp = re.sub('[* ]', '', j)
            train___.append(re.sub('[,]', '.', temp))
        train.append(train___)
    train = np.array(train).astype('float32')
    outlay.fit(train, target, epochs=15, batch_size = 1)
    outlay.save_weights(file_outlay)
    
    
def train_income(data1, data2, file_income):  #Исключительно под обучение на доходы!
                                       #file_income должен быть в таком формате: 'my_model_weights.h5'
    
    for i in range(len(data1)):
        data1[i] = data1[i].dropna(subset=[data1[i].columns[0], data1[i].columns[-1]])
        data2[i] = data2[i].dropna(subset=[data2[i].columns[0], data2[i].columns[-1]])
        data1[i] = data1[i].fillna(0)
        data2[i] = data2[i].fillna(0)
    
    train_data = []
    for h in data1[1:]:
        train_data.append(np.asarray(find_data(h, features1)[h.columns[1:]]).reshape(len(features1) * 6,))
    
    train_data_ = []
    for g in data2:
        train_data_.append(np.asarray(find_data(g, features2)[g.columns[-1]]))
    
    
    target = np.asarray(train_data_[1:]).astype('float32') - np.asarray(train_data_[:len(data2) - 1]).astype('float32')
    train_ = np.concatenate([train_data, train_data_[:len(data2) - 1]], axis = -1)
    train = []
    for i in train_: 
        train___ = []
        for j in i:
            temp = re.sub('[* ]', '', j)
            train___.append(re.sub('[,]', '.', temp))
        train.append(train___)
    train = np.array(train).astype('float32')
    income.fit(train, target, epochs=15, batch_size = 1)
    outlay.save_weights(file_income)


def predict_income(data1, data2, file_income):  #Исключительно под обучение на доходы!
    
    income.load_weights(file_income)
    train_data = []
    train_data_ = []
    data1 = data1.dropna(subset=[data1.columns[0], data1.columns[-1]]).drop_duplicates(subset = [data1.columns[0]])
    data2 = data2.dropna(subset=[data2.columns[0], data2.columns[-1]]).drop_duplicates(subset = [data2.columns[0]])
    data1 = data1.fillna(0)
    data2 = data2.fillna(0)

    train_data = (np.asarray(find_data(data1, features1)[data1.columns[1:]]).reshape(len(features1) * 6,))
    
    train_data_ = (np.asarray(find_data(data2, features2)[data2.columns[-1]]))
    
    pred = np.concatenate([train_data, train_data_])
    return income.predict(pred.reshape(-1, len(pred))) + train_data_


def predict_outlay(data1, data2, file_outlay):  #Исключительно под обучение на расходы!
    
    outlay.load_weights(file_outlay)
    train_data = []
    train_data_ = []
    data1 = data1.dropna(subset=[data1.columns[0], data1.columns[-1]]).drop_duplicates(subset = [data1.columns[0]])
    data2 = data2.dropna(subset=[data2.columns[0], data2.columns[-1]]).drop_duplicates(subset = [data2.columns[0]])
    data1 = data1.fillna(0)
    data2 = data2.fillna(0)

    train_data = (np.asarray(find_data(data1, features1)[data1.columns[1:]]).reshape(len(features1) * 6,))
    
    train_data_ = (np.asarray(find_data(data2, features2_outlay)[data2.columns[-1]]))
    
    pred = np.concatenate([train_data, train_data_])
    return outlay.predict(pred.reshape(-1, len(pred))) + train_data_