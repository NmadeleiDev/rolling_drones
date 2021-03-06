from tensorflow import keras
import pandas as pd
from Levenshtein import distance
import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Dense, Flatten, Input, Lambda
import re
def find_data(frame, features):
        rows = list(frame[frame.columns[1]])
        col = []
        for f in features:
            dist = []
            for r in rows:
                dist.append(distance(re.sub('[, /t]', '', str(f)), re.sub('[, /t]', '', str(r)))) 
            if rows:
                t = np.argmin(np.asarray(dist))
                if min(dist)/len(str(rows[t])) > 0.8:
                    print(dist, f, rows)
                    raise Exception("Not enought data")
                col.append(str(rows[t]))
                rows.remove(rows[t])
        return frame.loc[[i in col for i in frame[frame.columns[1]]]].drop_duplicates(subset = [frame.columns[1]]).sort_values(frame.columns[1])
    
features2_outlay = sorted(['Расходы бюджета - ИТОГО', 'ОБЩЕГОСУДАРСТВЕННЫЕ ВОПРОСЫ', 'НАЦИОНАЛЬНАЯ ОБОРОНА', 'ОБРАЗОВАНИЕ', 'КУЛЬТУРА, КИНЕМАТОГРАФИЯ', 'СОЦИАЛЬНАЯ ПОЛИТИКА', 'ФИЗИЧЕСКАЯ КУЛЬТУРА И СПОРТ', 'ОБСЛУЖИВАНИЕ ГОСУДАРСТВЕННОГО И МУНИЦИПАЛЬНОГО ДОЛГА'])
features2 = sorted(['НАЛОГОВЫЕ И НЕНАЛОГОВЫЕ ДОХОДЫ', 'НАЛОГИ НА ПРИБЫЛЬ, ДОХОДЫ', 'НАЛОГИ НА ТОВАРЫ (РАБОТЫ, УСЛУГИ), РЕАЛИЗУЕМЫЕ НА ТЕРРИТОРИИ РОССИЙСКОЙ ФЕДЕРАЦИИ', 'НАЛОГИ НА СОВОКУПНЫЙ ДОХОД', 'НАЛОГИ НА ИМУЩЕСТВО', 'НАЛОГИ, СБОРЫ И РЕГУЛЯРНЫЕ ПЛАТЕЖИ ЗА ПОЛЬЗОВАНИЕ ПРИРОДНЫМИ РЕСУРСАМИ', 'ДОХОДЫ ОТ ИСПОЛЬЗОВАНИЯ ИМУЩЕСТВА, НАХОДЯЩЕГОСЯ В ГОСУДАРСТВЕННОЙ И МУНИЦИПАЛЬНОЙ СОБСТВЕННОСТИ', 'ПЛАТЕЖИ ПРИ ПОЛЬЗОВАНИИ ПРИРОДНЫМИ РЕСУРСАМИ', 'ДОХОДЫ ОТ ПРОДАЖИ МАТЕРИАЛЬНЫХ И НЕМАТЕРИАЛЬНЫХ АКТИВОВ'])
features1 = sorted(['Численность постоянного населения (среднегодовая)',  
                    'Индекс промышленного производства (С+D+E)', 
                    'производство электрооборудования, электронного и оптического оборудования', 
                    'железорудные окатыши', 'древесина необработанная', 
                    'лесоматериалы продольно распиленные', 'древесностружечные плиты, плиты OSB', 
                    'целлюлоза древесная и целлюлоза из прочих волокнистых материалов (сульфатная, сульфитная)', 
                    'мешки бумажные', 'Картофель', 'бумага',
                    'Овощи', 'Скот и птица (в живом весе)', 'Молоко', 'Яйца', 
                    'Оборот розничной торговли', 'Объем платных услуг населению', 'Фонд заработной платы',
                    'Фонд заработной платы с учетом необлагаемой его части (для расчета налога на доходы физических лиц)',
                    'Среднегодовая остаточная стоимость облагаемого имущества - всего (база для исчисления налога на имущество организаций, поступающего в бюджет РК)',
                    'Экспорт – всего', 
                    'Численность безработных, зарегистрированных в службах занятости (среднегодовая)', 
                    'Уровень зарегистрированной безработицы (к численности экономически активного населения) (среднегодовая)'])

input_ = Input((len(features1) * 6 + len(features2),))
d = Dense(len(features2) * 4)(input_)
d = Dense(len(features2))(d)
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
        train_data.append(np.asarray(find_data(h, features1)[h.columns[2:]]).reshape(len(features1) * 6,))
    
    train_data_ = []
    for g in data2:
        train_data_.append(np.asarray(find_data(g, features2_outlay)[g.columns[-1]]))
    
    
    target = np.asarray(train_data_[1:]).astype('float32') - np.asarray(train_data_[:len(data2) - 1]).astype('float32')
    train_ = np.concatenate([train_data, train_data_[:len(data2) - 1]], axis = -1)
    train = []
    for i in train_: 
        train___ = []
        for j in i:
            temp = re.sub('[* /.,а-я]', '', str(j))
            train___.append(re.sub('[,]', '.', temp))
        train.append(train___)
    train = np.array(train).astype('float32')
    while np.linalg.norm(outlay.predict(train[0].reshape(-1, len(train[0]))) - target[0]) > 1000:
        outlay.fit(train, target, epochs=3, batch_size = 1)
    outlay.save_weights(file_outlay)
    
    
def train(data1, data2, file_income):  #Исключительно под обучение на доходы!
                                       #file_income должен быть в таком формате: 'my_model_weights.h5'
    
    for i in range(len(data1)):
        data1[i] = data1[i].dropna(subset=[data1[i].columns[0], data1[i].columns[-1]])
        data2[i] = data2[i].dropna(subset=[data2[i].columns[0], data2[i].columns[-1]])
        data1[i] = data1[i].fillna(0)
        data2[i] = data2[i].fillna(0)
        
    train_data = []
    for h in data1[1:]:
        train_data.append(np.asarray(find_data(h, features1)[h.columns[2:]]).reshape(len(features1) * 6,))
    
    train_data_ = []
    for g in data2:
        train_data_.append(np.asarray(find_data(g, features2)[g.columns[-1]]))
    
    
    target = np.asarray(train_data_[1:]).astype('float32') - np.asarray(train_data_[:len(data2) - 1]).astype('float32')
    train_ = np.concatenate([train_data, train_data_[:len(data2) - 1]], axis = -1)
    train = []
    for i in train_:
        train___ = []
        for j in i:
            temp = re.sub('[* /.,а-я]', '', str(j))
            train___.append(re.sub('[,]', '.', temp))
        train.append(train___)
    train = np.array(train).astype('float32')
    #print(train[1], target[1])
    while np.linalg.norm(income.predict(train[0].reshape(-1, len(train[0])))  - target[0]) > 1000:
            income.fit(train, target, epochs=3, batch_size = 1)
    outlay.save_weights(file_income)

    
def predict(data1, data2, file_income):  #Исключительно под обучение на доходы!
    
    income.load_weights(file_income)
    train_data = []
    train_data_ = []
    data1 = data1.dropna(subset=[data1.columns[0], data1.columns[-1]]).drop_duplicates(subset = [data1.columns[0]])
    data2 = data2.dropna(subset=[data2.columns[0], data2.columns[-1]]).drop_duplicates(subset = [data2.columns[0]])
    data1 = data1.fillna(0)
    data2 = data2.fillna(0)

    train_data = (np.asarray(find_data(data1, features1)[data1.columns[2:]]).reshape(len(features1) * 6,))
    
    train_data_ = (np.asarray(find_data(data2, features2)[data2.columns[-1]]))
    
    train = []
    for i in train_data:
        print(1)
        train___ = []
        for j in i:
            temp = re.sub('[* /.,а-я]', '', str(j))
            train___.append(re.sub('[,]', '.', temp))
        train.append(train___)
    train_data = np.array(train).astype('float32')
    
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

    train_data = (np.asarray(find_data(data1, features1)[data1.columns[2:]]).reshape(len(features1) * 6,))
    
    train_data_ = (np.asarray(find_data(data2, features2_outlay)[data2.columns[-1]]))
    
    train = []
    for i in train_data:
        print(1)
        train___ = []
        for j in i:
            temp = re.sub('[* /.,а-я]', '', str(j))
            train___.append(re.sub('[,]', '.', temp))
        train.append(train___)
    train_data = np.array(train).astype('float32')
    
    pred = np.concatenate([train_data, train_data_])
    return outlay.predict(pred.reshape(-1, len(pred))) + train_data_