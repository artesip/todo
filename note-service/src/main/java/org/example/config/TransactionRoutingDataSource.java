package org.example.config;

import org.example.model.DataSourceType;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
import org.springframework.transaction.support.TransactionSynchronizationManager;

public class TransactionRoutingDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        boolean isReadOnly = TransactionSynchronizationManager.isCurrentTransactionReadOnly();
        DataSourceType type = isReadOnly ? DataSourceType.REPLICA : DataSourceType.PRIMARY;

        System.out.println(">>>> CURRENT ROUTING KEY: " + type + " (isReadOnly: " + isReadOnly + ")");

        return type;
    }
}